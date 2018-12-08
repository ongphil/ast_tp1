"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const metrics_1 = require("./metrics");
const leveldb_1 = require("./leveldb");
const dbPath = "db_test/metrics";
var dbMet;
describe("Metrics", function () {
    before(function () {
        leveldb_1.LevelDb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    after(function () {
        dbMet.db.close();
    });
    /// SAVE
    describe("#save", function () {
        it("save one group of metrics", function (done) {
            // metric qui n'existe pas
            const met = [
                new metrics_1.Metric(`${new Date("2013-11-04 14:00 UTC").getTime()}`, 12),
                new metrics_1.Metric(`${new Date("2013-11-04 14:15 UTC").getTime()}`, 10),
                new metrics_1.Metric(`${new Date("2013-11-04 14:30 UTC").getTime()}`, 8)
            ];
            dbMet.saveUserMetricsWithKey('user', '0', met, function (err) {
                chai_1.expect(err).to.be.undefined;
                dbMet.getUserMetricsWithKey("user", "0", (err2, result) => {
                    chai_1.expect(err2).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.be.an("array");
                    chai_1.expect(result).to.not.be.empty;
                    done();
                });
            });
        });
        it("save one metric in a group", function (done) {
            // metric qui n'existe pas
            const met = new metrics_1.Metric(`${new Date("2019-11-04 14:00 UTC").getTime()}`, 12);
            dbMet.saveUserOneMetricWithKey('user', '0', met, function (err) {
                chai_1.expect(err).to.be.undefined;
                dbMet.getUserMetricsWithKey("user", "0", (err2, result) => {
                    chai_1.expect(err2).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.be.an("array");
                    chai_1.expect(result).to.not.be.empty;
                    done();
                });
            });
        });
        it("should update data", function (done) {
            // metric qui existe déjà
            const met = new metrics_1.Metric(`${new Date("2018-12-07 20:00 UTC").getTime()}`, 16);
            const met2 = new metrics_1.Metric(`${new Date("2018-12-07 20:00 UTC").getTime()}`, 130);
            dbMet.saveUserOneMetricWithKey('user', '0', met, function (err) {
                chai_1.expect(err).to.be.undefined;
                dbMet.updateUserOneMetricWithKey('user', '0', met2, function (err2) {
                    chai_1.expect(err2).to.be.null;
                    dbMet.getUserMetricsWithKey('user', '0', function (err3, result) {
                        chai_1.expect(err3).to.be.null;
                        chai_1.expect(result).to.not.be.undefined;
                        chai_1.expect(result).to.be.an("array");
                        chai_1.expect(result).to.not.be.empty;
                        done();
                    });
                });
            });
        });
    });
    /// GET
    describe("#get", function () {
        it("should get a group of metrics", function (done) {
            dbMet.getUserMetricsWithKey("user", "0", (err, result) => {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.an("array");
                chai_1.expect(result).to.not.be.empty;
                done();
            });
        });
        it("should get all group of metrics of a user", function (done) {
            dbMet.getAllUserMetrics("user5", (err, result) => {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.not.be.empty;
                done();
            });
        });
    });
    /// DELETE
    describe("#delete", function () {
        it("should delete data", function (done) {
            dbMet.removeUserMetricsWithKey('user', '0', (err1) => {
                chai_1.expect(err1).to.be.null;
                dbMet.getUserMetricsWithKey("user", "0", (err2, result2) => {
                    chai_1.expect(err2).to.be.null;
                    chai_1.expect(result2).to.not.be.undefined;
                    chai_1.expect(result2).to.be.an("array");
                    chai_1.expect(result2).to.be.empty;
                    done();
                });
            });
        });
        it("should not fail if data does not exist", function (done) {
            dbMet.removeUserMetricsWithKey('user', '24', (err) => {
                chai_1.expect(err).to.be.null;
                done();
            });
        });
    });
});
