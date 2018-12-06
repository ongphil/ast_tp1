import { LevelDb } from "./leveldb";
import WriteStream from "level-ws";

export class Metric {
  public timestamp: string;
  public value: number;

  constructor(ts: string, v: number) {
    this.timestamp = ts;
    this.value = v;
  }
}

export class MetricsHandler {
  public db: any;

  constructor(path: string) {
    this.db = LevelDb.open(path);
  }

  /*
    Sauvegarde un groupe de metrics
  */
  public saveUserMetricsWithKey(
    username: string,
    key: string,
    met: Metric[],
    callback: (error: Error | null) => void
  ) {
    const stream = WriteStream(this.db);

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
  public saveUserOneMetricWithKey(
    username: string,
    key: string,
    met: Metric,
    callback: (error: Error | null) => void
  ) {
    const stream = WriteStream(this.db);

    stream.on("error", callback);
    stream.on("close", callback);

    stream.write({ key: `metric:${username}:${key}:${met.timestamp}`, value: met.value });

    stream.end();
      
  }
  /*
    Supprime un groupe de metrics d'un user
  */
  public removeUserMetricsWithKey(
    username: string,
    key: string,
    callback: (err: Error | null, result?: Metric[]) => void
  ) {
    const stream = this.db.createReadStream();
    var met: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, met);
      })
      .on("data", (data: any) => {
        const [, u, k,timestamp] = data.key.split(":");
        const value = data.value;
        if (key != k || username != u) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        } else {
          this.db.del(data.key);
        }
      });
  }

  /*
    Affiche UN groupe de metrics d'un user
  */
  public getUserMetricsWithKey(
    username: string,
    key: string,
    callback: (err: Error | null, result?: Metric[]) => void
  ) {
    const stream = this.db.createReadStream();
    var met: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, met);
      })
      .on("data", (data: any) => {
        const [, u, k, timestamp] = data.key.split(":");
        const value = data.value;
        if (key != k || username != u) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        } else {
          met.push(new Metric(timestamp, value));
        }
      });
  }

  /*
    Affichage tous les groupes de metrics d'un user
  */
  public getAllUserMetrics(
    username: string,
    callback: (err: Error | null, result?: {}) => void
  ) {
    const stream = this.db.createReadStream();
    let allKeys = new Array();
    let met = new Array();
    let metObject = {};
    met.push(metObject);

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, met);
      })
      .on("data", (data: any) => {
        const [, u, k, timestamp] = data.key.split(":");
        const value = data.value;
        if(username === u) {
          if(allKeys.indexOf(k) == -1) {
            allKeys.push(k);
            met[0][k] = [];
          }
          met[0][k].push(new Metric(timestamp, value));
        }
        
      });
  }
}
