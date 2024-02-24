interface ParkrunEventsHandler {
  scheduled(
    event: ScheduledController,
    env: { EVENT_SCRAPE_QUEUE: Queue }
  ): Promise<void>;
}

interface JsonEvent {
  id: number;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    eventname: string;
    EventLongName: string;
    EventShortName: string;
    LocalisedEventLongName: string | null;
    countrycode: number;
    seriesid: number;
    EventLocation: number;
  };
}

interface Country {
  url: string | null;
  bounds: number[];
}

interface ParkrunEventJson {
  countries: Country[];
  events: {
    type: string;
    features: JsonEvent[];
  };
}
