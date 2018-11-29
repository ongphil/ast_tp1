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
    save(key, met, callback) {
        const stream = level_ws_1.default(this.db);
        stream.on("error", callback);
        stream.on("close", callback);
        met.forEach(m => {
            stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value });
        });
        stream.end();
    }
    remove(key, callback) {
        const stream = this.db.createReadStream();
        var met = [];
        stream
            .on("error", callback)
            .on("end", (err) => {
            callback(null, met);
        })
            .on("data", (data) => {
            const [, k, timestamp] = data.key.split(":");
            const value = data.value;
            if (key != k) {
                console.log(`Level DB error: ${data} does not match key ${key}`);
            }
            else {
                this.db.del(data.key);
            }
        });
    }
    get(key, callback) {
        const stream = this.db.createReadStream();
        var met = [];
        stream
            .on("error", callback)
            .on("end", (err) => {
            callback(null, met);
        })
            .on("data", (data) => {
            const [, k, timestamp] = data.key.split(":");
            const value = data.value;
            if (key != k) {
                console.log(`Level DB error: ${data} does not match key ${key}`);
            }
            else {
                met.push(new Metric(timestamp, value));
            }
        });
    }
}
exports.MetricsHandler = MetricsHandler;
