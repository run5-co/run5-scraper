interface ParkrunEventsHandler<Message> {
  queue(
    batch: MessageBatch<Message>,
    env: { PARKRUN_EVENTS: KVNamespace },
    ctx: ExecutionContext
  ): Promise<void>;
}

interface LangDictionary {
  [key: string]: {
    lang: string;
    countryCode: string;
    eventTimeString: (weekdays: string[]) => RegExp;
    addressString: RegExp;
    distanceString: RegExp;
  };
}

interface ParkrunCountries {
  [key: string]: {
    url: string | null;
    bounds: number[];
  };
}

interface Environment {}
