#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from "../src/metrics";

const dbMet = new MetricsHandler("./db/metrics");

const met = [
  new Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 12),
  new Metric(`${new Date("2013-11-04 14:15 UTC").getTime()}`, 10),
  new Metric(`${new Date("2013-11-04 14:30 UTC").getTime()}`, 8)
];
const met1 = [
  new Metric(`${new Date("2013-11-04 15:00 UTC").getTime()}`, 34),
  new Metric(`${new Date("2013-11-04 15:15 UTC").getTime()}`, 23),
  new Metric(`${new Date("2013-11-04 15:30 UTC").getTime()}`, 12)
];

dbMet.save("0", met, (err: Error | null) => {
  if (err) throw err;
  console.log("Data populated");
});

dbMet.save("1", met1, (err: Error | null) => {
  if (err) throw err;
  console.log("Data populated");
});
