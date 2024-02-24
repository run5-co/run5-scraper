const websiteLangDictionary: LangDictionary = {
  "www.parkrun.org.uk": {
    lang: "en",
    countryCode: "GB",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.ie": {
    lang: "en",
    countryCode: "IE",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.us": {
    lang: "en",
    countryCode: "US",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.ca": {
    lang: "en",
    countryCode: "CA",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.my": {
    lang: "en",
    countryCode: "MY",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.co.za": {
    lang: "en",
    countryCode: "ZA",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.sg": {
    lang: "en",
    countryCode: "SG",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.com.au": {
    lang: "en",
    countryCode: "AU",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.co.nz": {
    lang: "en",
    countryCode: "NZ",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<=[Ee]very )(${weekdays.join(
          "|"
        )})(?= at )|(?<=[Ee]very (${weekdays.join(
          "|"
        )}) at )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=The event takes place (in|at) ).+(?=\. See)/,
    distanceString: /(?<=weekly )[0-9]+(?=km? )/,
  },
  "www.parkrun.co.nl": {
    lang: "nl",
    countryCode: "NL",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Iedere )(${weekdays.join(
          "|"
        )})(?=.* om )|(?<= *Iedere (${weekdays.join(
          "|"
        )}).* om )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=Het evenement vindt hier plaats: ).+(?=\.)/,
    distanceString: /(?<=Een wekelijks )[0-9]+(?=km? )/,
  },
  "www.parkrun.com.de": {
    lang: "de",
    countryCode: "DE",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Jeden )(${weekdays.join(
          "|"
        )})(?=.* um )|(?<= *Jeden (${weekdays.join(
          "|"
        )}).* um )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=Der Lauf findet hier statt: ).+(?=\.)/,
    distanceString: /(?<=Lauf oder Spaziergang über )[0-9]+(?= ?km? )/,
  },
  "www.parkrun.co.at": {
    lang: "de",
    countryCode: "AT",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Jeden )(${weekdays.join(
          "|"
        )})(?=.* um )|(?<= *Jeden (${weekdays.join(
          "|"
        )}).* um )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString: /(?<=Der Lauf findet hier statt: ).+(?=\.)/,
    distanceString: /(?<=Lauf oder Spaziergang über )[0-9]+(?= ?km? )/,
  },
  "www.parkrun.fr": {
    lang: "fr",
    countryCode: "FR",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Chaque )(${weekdays.join(
          "|"
        )})(?=.* à )|(?<= *Chaque (${weekdays.join(
          "|"
        )}).* à )[0-9]?[0-9][\.:][0-9][0-9](am|pm)`,
        "g"
      ),
    addressString:
      /(?<= ).+(?=. Voir la page parcours pour plus d'informations.)/,
    distanceString: /(?<=hebdomadaire de )[0-9]+(?= ?km? )/,
  },
  "www.parkrun.dk": {
    lang: "dk",
    countryCode: "DK",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Hver )(${weekdays.join(
          "|"
        )})(?=.* kl. )|(?<= *Hver (${weekdays.join(
          "|"
        )}).* kl. )[0-9]?[0-9][\.:][0-9][0-9](am|pm)?`,
        "g"
      ),
    addressString: /(?<= ).+(?=. Se på rutesiden for flere detaljer.)/,
    distanceString: /(?<=fællesskab om et )[0-9]+(?= ?km?)/,
  },
  "www.parkrun.se": {
    lang: "se",
    countryCode: "SE",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Varje )(${weekdays.join(
          "|"
        )})(?=.* vid )|(?<= *Varje (${weekdays.join(
          "|"
        )}).* vid )[0-9]?[0-9][\.:][0-9][0-9](am|pm)?`,
        "g"
      ),
    addressString:
      /(?<= ).+(?=. Klicka på banan för att hitta mer information.)/,
    distanceString: /(?<=roligt och trevligt )[0-9]+(?= ?km? )/,
  },
  "www.parkrun.no": {
    lang: "no",
    countryCode: "NO",
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(?<= *Hver )(${weekdays.join(
          "|"
        )})(?=.* kl. )|(?<= *Hver (${weekdays.join(
          "|"
        )}).* kl. )[0-9]?[0-9][\.:][0-9][0-9](am|pm)?`,
        "g"
      ),
    addressString: /(?<=Eventet gjennomføres på ).+(?=\.)/,
    distanceString: /(?<=løp på )[0-9]+(?= ?km?)/,
  },
  "www.parkrun.fi": {
    lang: "fi",
    countryCode: "FI",
    // Finland has the weekday at the start of the sentence so capitalize the first letter
    eventTimeString: (weekdays: string[]) =>
      new RegExp(
        `(${weekdays
          .map((day) => day.replace(/\b\S/g, (t) => t.toUpperCase()))
          .join("|")}sin)(?=.* klo )|(?<=(${weekdays
          .map((day) => day.replace(/\b\S/g, (t) => t.toUpperCase()))
          .join("|")}sin).* klo )[0-9]?[0-9][\.:][0-9][0-9](am|pm)?`,
        "g"
      ),
    addressString: /(?<=Eventet gjennomføres på ).+(?=\.)/,
    distanceString: /(?<=løp på )[0-9]+(?= ?km?)/,
  },
};

// TODO: Poland, Italy, Japan

export default websiteLangDictionary;
