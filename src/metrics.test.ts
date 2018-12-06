import { expect } from "chai";
import { Metric, MetricsHandler } from "./metrics";
import { LevelDb } from "./leveldb";

const dbPath: string = "db_test/metrics";
var dbMet: MetricsHandler;

describe("Metrics", function() {
  before(function() {
    LevelDb.clear(dbPath);
    dbMet = new MetricsHandler(dbPath);
  });

  after(function() {
    dbMet.db.close();
  });

  describe("#save", function() {
    it("should save data", function(done) {
      // metric qui n'existe pas
      const met = new Metric(`${new Date("2019-11-04 14:00 UTC").getTime()}`, 12);
      dbMet.saveUserOneMetricWithKey('user', '0', met, function (err: Error | null) {
        expect(err).to.be.undefined;
        
        dbMet.getUserMetricsWithKey("user", "0", (err2: Error | null, result?: Metric[]) => {
          expect(err2).to.be.null;
          expect(result).to.not.be.undefined;
          expect(result).to.be.an("array");
          expect(result).to.not.be.empty;
          done();
        });
      });
    });

    it("should update data", function(done) {
      // metric qui existe déjà
      const met = new Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 12);
      dbMet.saveUserOneMetricWithKey('user', '0', met,(err: Error | null, result?: Metric) => {
        expect(err).to.be.null;
        dbMet.getUserMetricsWithKey("user", "0", (err: Error | null, result?: Metric[]) => {
          expect(err).to.be.null;
          expect(result).to.not.be.undefined;
          expect(result).to.be.an("array");
          expect(result).to.be.empty;
          done();
        });
      });
    });
  });

  describe("#get", function() {
    it("should get empty array on non existing group", function(done) {
      dbMet.getUserMetricsWithKey("user", "0", (err: Error | null, result?: Metric[]) => {
        expect(err).to.be.null;
        expect(result).to.not.be.undefined;
        expect(result).to.be.an("array");
        expect(result).to.be.empty;
        done();
      });
    });
  });

  describe("#delete", function() {
    it("should delete data", function(done) {
      dbMet.removeUserMetricsWithKey('user', '0',(err: Error | null, result?: Metric[]) => {
        expect(err).to.be.null;
        dbMet.getUserMetricsWithKey("user", "0", (err: Error | null, result?: Metric[]) => {
          expect(err).to.be.null;
          expect(result).to.not.be.undefined;
          expect(result).to.be.an("array");
          expect(result).to.be.empty;
          done();
        });
      });
    });

    it("should not fail if data does not exist", function(done) {
      dbMet.removeUserMetricsWithKey('user', '0',(err: Error | null, result?: Metric[]) => {
        expect(err).to.be.null;
        expect(result).to.be.empty;
        done();
      });
    });
  });
});
