#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from "../src/metrics";
import { UserHandler, User } from "../src/users";

const dbMet = new MetricsHandler("./db/metrics");
const dbUser = new UserHandler("./db/users");

const met = [
  new Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 12),
  new Metric(`${new Date("2013-11-04 14:15 UTC").getTime()}`, 10),
  new Metric(`${new Date("2013-11-04 14:30 UTC").getTime()}`, 8)
];

const met2 = [
  new Metric(`${new Date("2013-11-04 15:00 UTC").getTime()}`, 22),
  new Metric(`${new Date("2013-11-04 15:15 UTC").getTime()}`, 20),
  new Metric(`${new Date("2013-11-04 15:30 UTC").getTime()}`, 18)
];

const user = new User("user", "user@test.com", "user");

dbMet.saveUserMetricsWithKey("user", "0", met, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});
dbMet.saveUserMetricsWithKey("user", "1", met2, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});

dbUser.save(user, (err: Error | null) => {
  if (err) throw err;
  console.log("Data user populated");
});
