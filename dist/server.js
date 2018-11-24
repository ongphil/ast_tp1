"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const metrics_1 = require("./metrics");
const bodyparser = require("body-parser");
const app = express();
const port = process.env.PORT || "8080";
const dbMet = new metrics_1.MetricsHandler("./db");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.get("/", (req, res) => {
    res.write("Hello world");
    res.send();
});
app.get("/metrics/:id", (req, res) => {
    dbMet.get(req.params.id, (err, result) => {
        if (err)
            throw err;
        if (result === undefined) {
            res.write("no result");
            res.send();
        }
        else
            res.json(result);
    });
});
app.post("/metrics/:id", (req, res) => {
    dbMet.save(req.params.id, req.body, (err) => {
        if (err) {
            res.status(500);
            throw err;
        }
        res.status(200).send();
    });
});
app.delete("/metrics/:id", (req, res) => {
    dbMet.delete(req.params.id, (err) => {
        if (err) {
            res.status(500);
            throw err;
        }
        res.status(200).send();
    });
});
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`Server is listening on port ${port}`);
});
