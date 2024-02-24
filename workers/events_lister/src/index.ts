import { z } from "zod";
import { ParkrunEvent } from "./proto/internal/single_event_pb";

function* parkrunEventIterator(
  countries: Country[],
  eventFeatures: JsonEvent[]
): Iterator<MessageSendRequest<ArrayBuffer>> {
  for (let singleEvent of eventFeatures) {
    const event = new ParkrunEvent({
      id: singleEvent.properties.eventname,
      countryUrl:
        countries[singleEvent.properties.countrycode].url || undefined,
      name: {
        shortName: singleEvent.properties.EventShortName,
        longName: singleEvent.properties.EventLongName,
        localisedName:
          singleEvent.properties.LocalisedEventLongName || undefined,
      },
      location: {
        geoCoordinates: {
          latitude: singleEvent.geometry.coordinates[1],
          longitude: singleEvent.geometry.coordinates[0],
        },
      },
    });
    if (!["www.parkrun.org.uk", "www.parkrun.ie", "www.parkrun.us", "www.parkrun.com.au", "www.parkrun.ca", "www.parkrun.my", "www.parkrun.sg", "www.parkrun.co.za", "www.parkrun.co.nz"].includes(event.countryUrl)) {
      const binaryEvent = event.toBinary()
      console.log(`${singleEvent.properties.eventname} ${binaryEvent.toString()}`)
      yield {
        body: binaryEvent,
        contentType: "bytes",
      };
    }
  }
}

// This generator creates an iterator that only contains (limit) number of items from a source iterator.
// We need to know when the first iterator is done and the only way to do this is to call next() on the source iterator
// So we feed that in as firstValue so we don't lose any item
function* take(
  iterator: Iterator<any>,
  limit: number,
  firstValue: any = null
): any {
  let remaining = limit - 1;
  if (firstValue) {
    yield firstValue;
    remaining--;
  }
  let value = iterator.next();
  while (!value.done) {
    yield value.value;
    if (remaining <= 0) return;
    value = iterator.next();
    remaining--;
  }
  return;
}

const handler: ParkrunEventsHandler = {
  async scheduled(event, env) {
    const response = await fetch("https://images.parkrun.com/events.json");
    const responseJson = (await response.json()) as ParkrunEventJson;

    const eventIterator = parkrunEventIterator(
      responseJson.countries,
      responseJson.events.features
    );

    let eventDone = false;
    let nextValue;
    while (!eventDone) {
      const slice = take(eventIterator, 100, nextValue);
      // console.log(Array.from(slice));
      // eventDone = true;
      await env.EVENT_SCRAPE_QUEUE.sendBatch(slice);
      const { value, done } = eventIterator.next();
      nextValue = value;
      eventDone = done !== false;
    }
  },
};

export default handler;
