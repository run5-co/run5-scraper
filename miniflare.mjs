import { Miniflare, Log } from "miniflare";

const mf = new Miniflare({
  workers: [
    {
      name: "events-lister",
      modules: true,
      scriptPath: "workers/events-lister/out.js",
      compatibilityDate: "2023-07-01",
      queueProducers: { EVENT_SCRAPE_QUEUE: "event-scrape-queue" },
    },
    {
      name: "events-scraper",
      modules: true,
      scriptPath: "workers/events-scraper/out.js",
      compatibilityDate: "2023-07-01",
      queueConsumers: { "event-scrape-queue": { maxBatchSize: 20 } },
      kvNamespaces: ["PARKRUN_EVENTS"],
    },
  ],
});

const worker = await mf.getWorker("events-lister");

const scheduledResult = await worker.scheduled({
  cron: "* * * * *",
});

// console.log(scheduledResult);

const queue = await mf.getQueueProducer("EVENT_SCRAPE_QUEUE", "events-lister");

// const queueResults = await queue.send(
//   Uint8Array.from([
//     10, 14, 97, 109, 115, 116, 101, 114, 100, 97, 109, 115, 101, 98, 111, 115,
//     18, 17, 119, 119, 119, 46, 112, 97, 114, 107, 114, 117, 110, 46, 99, 111,
//     46, 110, 108, 26, 42, 10, 15, 65, 109, 115, 116, 101, 114, 100, 97, 109,
//     115, 101, 32, 66, 111, 115, 18, 23, 65, 109, 115, 116, 101, 114, 100, 97,
//     109, 115, 101, 32, 66, 111, 115, 32, 112, 97, 114, 107, 114, 117, 110, 34,
//     12, 10, 10, 13, 115, 77, 81, 66, 21, 201, 99, 155, 64,
//   ]).buffer
// );

// await mf.dispose();
