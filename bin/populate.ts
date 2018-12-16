#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from "../src/metrics";
import { UserHandler, User } from "../src/users";

const dbMet = new MetricsHandler("./db/metrics");
const dbUser = new UserHandler("./db/users");

/// USER 1

const met = [
  new Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 11),
  new Metric(`${new Date("2013-11-04 14:15 UTC").getTime()}`, 4),
  new Metric(`${new Date("2013-11-04 14:30 UTC").getTime()}`, 8)
];

const met2 = [
  new Metric(`${new Date("2013-11-04 15:00 UTC").getTime()}`, 13),
  new Metric(`${new Date("2013-11-04 15:15 UTC").getTime()}`, 11),
  new Metric(`${new Date("2013-11-04 15:30 UTC").getTime()}`, 9)
];

const user = new User("user", "user@test.com", "user");

dbUser.save(user, (err: Error | null) => {
  if (err) throw err;
  console.log("Data user populated, you can connect with :");
  console.log("username: user");
  console.log("password : user")
});

dbMet.saveUserMetricsWithKey("user", "0", met, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});
dbMet.saveUserMetricsWithKey("user", "1", met2, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});


/// USER 2

const met3 = [
  new Metric(`${new Date("2014-03-24 16:00 UTC").getTime()}`, 19),
  new Metric(`${new Date("2014-03-24 16:15 UTC").getTime()}`, 23),
  new Metric(`${new Date("2014-03-24 16:30 UTC").getTime()}`, 14)
];

const met4 = [
  new Metric(`${new Date("2014-03-24 17:00 UTC").getTime()}`, 6),
  new Metric(`${new Date("2014-03-24 17:15 UTC").getTime()}`, 9),
  new Metric(`${new Date("2014-03-24 17:30 UTC").getTime()}`, 15)
];

const user2 = new User("user2", "user2@test.com", "user2");

dbUser.save(user2, (err: Error | null) => {
  if (err) throw err;
  console.log("Data user2 populated, you can connect with :");
  console.log("username: user2");
  console.log("password : user2")
});

dbMet.saveUserMetricsWithKey("user2", "0", met3, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});
dbMet.saveUserMetricsWithKey("user2", "1", met4, (err: Error | null) => {
  if (err) throw err;
  console.log("Data metrics populated");
});
