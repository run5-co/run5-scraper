import { z } from "zod";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import { countries } from "./countries.json";
import { ParkrunEvent } from "./proto/internal/single_event_pb";
import { AugmentedParkrunEvent } from "./proto/internal/augmented_event_pb";
import websiteLangDictionary from "./languages";

const typedCountries = countries as ParkrunCountries;

const eventInfoResponseValidator = z.object({
  id: z.string().regex(/^[a-z]+$/),
  url: z.string().url(),
  fullName: z.string(),
  email: z.string().email(),
});

type EventInfo = z.infer<typeof eventInfoResponseValidator>;

function daysForLocale(language: string, countryCode: string) {
  const { format } = new Intl.DateTimeFormat(`${language}-${countryCode}`, {
    weekday: "long",
  });
  return [...Array(7).keys()].map((day) =>
    format(new Date(Date.UTC(2021, 5, day)))
  );
}

// Abuse the HTMLRewriter API by reading the stream into the void, so that all callbacks are triggered
async function consume(stream: ReadableStream) {
  const reader = stream.getReader();
  while (!(await reader.read()).done) {
    /* NOOP */
  }
}

async function eventInfoHandler(
  message: Message<ArrayBuffer>,
  table: KVNamespace
) {
  const data = new ParkrunEvent().fromBinary(new Uint8Array(message.body));

  const id = data.id;
  const remoteUrl = `https://${data.countryUrl}/${id}/`;
  const langDictionary = websiteLangDictionary[data.countryUrl];
  const response = await fetch(remoteUrl, {
    // There is an AWS WAF in front of the website doing basic user agent string checking
    // We override the user agent string of the worker to a Firefox browser
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0",
    },
    cf: {
      scrapeShield: false,
    },
  });

  const timeZone = tzlookup(
    data.location?.geoCoordinates?.latitude as number,
    data.location?.geoCoordinates?.longitude as number
  );

  // Create an response object to add info to. This will be validated once HTML parsing is complete
  let remoteResponse: Record<string, any> = {
    // id: id, // This info is placed into the KV key
    fullName: [
      {
        languageCode: langDictionary.lang,
        text: data.name?.localisedName || data.name?.longName,
      },
    ],
    location: {
      latlng: data.location?.geoCoordinates?.toJson(),
      // countryCode: langDictionary.countryCode, // This info is placed into the KV key
    },
    url: remoteUrl,
    email: `${id.replace(/[^a-z0-9]/g, "")}@parkrun.com`,
    course: {
      distance: {},
    },
    weeklyOccurence: {
      timeZone: {
        id: timeZone,
        version: "2018i",
      },
    },
  };
  // If there is a localized version and the event language is not english, set the standard long name as the English translation
  if (data.name?.localisedName && !langDictionary.lang.startsWith("en")) {
    remoteResponse.fullName.push({
      languageCode: "en",
      text: data.name?.longName,
    });
  }

  let workingString = "";

  const mainRewriter = new HTMLRewriter()
    // .on("h1.paddetandb", {
    //   // Get parkrun name
    //   text(te) {
    //     if (!te?.lastInTextNode) {
    //       createOrAppendString(remoteResponse, "fullName", te.text);
    //     } else {
    //       remoteResponse.fullName = remoteResponse.fullName.trim();
    //     }
    //   },
    // })
    .on("p.paddetandb", {
      // Get time
      text({ text, lastInTextNode }) {
        if (lastInTextNode) {
          const weekdays = daysForLocale(
            langDictionary.lang,
            langDictionary.countryCode
          );
          const dateTimeCapture = workingString.match(
            langDictionary.eventTimeString(weekdays)
          );
          if (dateTimeCapture?.length == 2) {
            // Some countries like Denmark don't have am/pm in the time, if not included assume am
            const amPm = ["am", "pm"].includes(dateTimeCapture[1].slice(-2))
              ? ""
              : "am";
            const weeklyTime = DateTime.fromFormat(
              `${dateTimeCapture[1]}${amPm} ${timeZone}`,
              "h:mma z",
              { setZone: true }
            );
            remoteResponse.weeklyOccurence.dayOfWeek =
              weekdays.indexOf(dateTimeCapture[0]) + 1;
            remoteResponse.weeklyOccurence.timeOfDay = {
              hours: weeklyTime.get("hour"),
              minutes: weeklyTime.get("minute"),
            };
          }

          const addressCapture = workingString.match(
            langDictionary.addressString
          );
          if (addressCapture?.length == 1) {
            remoteResponse.location.descriptor = addressCapture[0];
          }

          const distanceCapture = workingString.match(
            langDictionary.distanceString
          );
          if (distanceCapture?.length == 1) {
            remoteResponse.course.distance.km = parseInt(distanceCapture[0]);
          }

          workingString = "";
        } else {
          workingString += text;
        }
      },
      // element(el) {
      //   if (el.getAttribute("href")?.startsWith("/cdn-cgi/l/email-protection")) {
      //     remoteResponse.contactEmail = el
      //       .getAttribute("href")
      //       ?.replace(/^mailto:/g, "");
      //   }
      // },
    });

  await consume(mainRewriter.transform(response).body!);

  const courseResponse = await fetch(`${remoteUrl}/course/`, {
    // There is an AWS WAF in front of the website doing basic user agent string checking
    // We override the user agent string of the worker to a Firefox browser
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0",
    },
    cf: {
      scrapeShield: false,
    },
  });

  const courseRewriter = new HTMLRewriter().on("iframe", {
    element(el) {
      const srcAttr = el.getAttribute("src");
      const mapsLink = "https://www.google.com/maps/d/embed";
      if (srcAttr?.startsWith(mapsLink)) {
        const searchParams = new URLSearchParams(srcAttr);
        // Sometimes it misinterprets the entire URL as the MID, unsure why.
        remoteResponse.course.googleMapsMid =
          searchParams.get("mid") || searchParams.get(`${mapsLink}?mid`);
      }
    },
  });

  await consume(courseRewriter.transform(courseResponse).body!);

  const parkrunType = id.split("-")[1] || "standard";

  try {
    const buf = AugmentedParkrunEvent.fromJson(remoteResponse);
    await table.put(
      [parkrunType, langDictionary.countryCode, id].join(":"),
      buf.toBinary().buffer
    );
    console.log(buf.toJson());
  } catch (e) {
    console.error(`[${remoteUrl}] ${e}`);
  }
  message.ack();
}

const handler: ParkrunEventsHandler<ArrayBuffer> = {
  async queue(batch, env, ctx): Promise<void> {
    await Promise.allSettled(
      batch.messages.map((event) => eventInfoHandler(event, env.PARKRUN_EVENTS))
    );
    // return Response.json(remoteResponse);
  },
};

export default handler;

// const testData = { body: Uint8Array.from([
//   10, 14, 97, 109, 115, 116, 101, 114, 100, 97, 109, 115, 101, 98, 111, 115,
//   18, 17, 119, 119, 119, 46, 112, 97, 114, 107, 114, 117, 110, 46, 99, 111,
//   46, 110, 108, 26, 42, 10, 15, 65, 109, 115, 116, 101, 114, 100, 97, 109,
//   115, 101, 32, 66, 111, 115, 18, 23, 65, 109, 115, 116, 101, 114, 100, 97,
//   109, 115, 101, 32, 66, 111, 115, 32, 112, 97, 114, 107, 114, 117, 110, 34,
//   12, 10, 10, 13, 115, 77, 81, 66, 21, 201, 99, 155, 64,
// ]).buffer}

// eventInfoHandler(testData)
