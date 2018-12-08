"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leveldb_1 = require("./leveldb");
const level_ws_1 = __importDefault(require("level-ws"));
class Metric {
    constructor(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
}
exports.Metric = Metric;
class MetricsHandler {
    constructor(path) {
        this.db = leveldb_1.LevelDb.open(path);
    }
    /*
      Sauvegarde un groupe de metrics
    */
    saveUserMetricsWithKey(username, key, met, callback) {
        const stream = level_ws_1.default(this.db);
        stream.on("error", callback);
        stream.on("close", callback);
        met.forEach(m => {
            stream.write({ key: `metric:${username}:${key}:${m.timestamp}`, value: m.value });
        });
        stream.end();
    }
    /*
      Ajouter un metric à un groupe de metrics
    */
    saveUserOneMetricWithKey(username, key, met, callback) {
        const stream = level_ws_1.default(this.db);
        stream.on("error", callback);
        stream.on("close", callback);
        stream.write({ key: `metric:${username}:${key}:${met.timestamp}`, value: met.value });
        stream.end();
    }
    /*
      Updater un metric
    */
    updateUserOneMetricWithKey(username, key, met, callback) {
        let metricsGroupResult;
        this.getUserMetricsWithKey(username, key, (err, result) => {
            if (err) {
                callback(err);
            }
            else {
                metricsGroupResult = result;
                for (const metricIndex in metricsGroupResult) {
                    if (metricsGroupResult[metricIndex].timestamp === met.timestamp) {
                        metricsGroupResult.splice(metricIndex, 1, met);
                    }
                }
                this.removeUserMetricsWithKey(username, key, (err) => {
                    if (err) {
                        callback(err);
                    }
                    else {
                        this.saveUserMetricsWithKey(username, key, metricsGroupResult, (err) => {
                            if (err) {
                                callback(err);
                            }
                            else {
                                callback(null);
                            }
                        });
                    }
                });
            }
        });
    }
    /*
      Supprime un groupe de metrics d'un user
    */
    removeUserMetricsWithKey(username, key, callback) {
        const stream = this.db.createReadStream();
        var met = [];
        stream
            .on("error", callback)
            .on("end", (err) => {
            callback(null);
        })
            .on("data", (data) => {
            const [, u, k, timestamp] = data.key.split(":");
            const value = data.value;
            if (key != k || username != u) {
                console.log(`Level DB error: ${data} does not match key ${key}`);
            }
            else {
                this.db.del(data.key);
            }
        });
    }
    /*
      Affiche UN groupe de metrics d'un user
    */
    getUserMetricsWithKey(username, key, callback) {
        const stream = this.db.createReadStream();
        var met = [];
        stream
            .on("error", callback)
            .on("end", (err) => {
            callback(null, met);
        })
            .on("data", (data) => {
            const [, u, k, timestamp] = data.key.split(":");
            const value = data.value;
            if (key != k || username != u) {
                console.log(`Level DB error: ${data} does not match key ${key}`);
            }
            else {
                met.push(new Metric(timestamp, value));
            }
        });
    }
    /*
      Affichage tous les groupes de metrics d'un user
    */
    getAllUserMetrics(username, callback) {
        const stream = this.db.createReadStream();
        let allKeys = new Array();
        let met = new Array();
        let metObject = {};
        met.push(metObject);
        stream
            .on("error", callback)
            .on("end", (err) => {
            callback(null, met);
        })
            .on("data", (data) => {
            const [, u, k, timestamp] = data.key.split(":");
            const value = data.value;
            if (username === u) {
                if (allKeys.indexOf(k) == -1) {
                    allKeys.push(k);
                    met[0][k] = [];
                }
                met[0][k].push(new Metric(timestamp, value));
            }
        });
    }
}
exports.MetricsHandler = MetricsHandler;
