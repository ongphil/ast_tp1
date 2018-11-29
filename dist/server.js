"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const metrics_1 = require("./metrics");
const bodyparser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const levelSession = require("level-session-store");
const users_1 = require("./users");
const path = require("path");
const LevelStore = levelSession(session);
const app = express();
const port = process.env.PORT || "8080";
const dbMet = new metrics_1.MetricsHandler("./db/metrics");
const dbUser = new users_1.UserHandler("./db/users");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(morgan("dev"));
app.use(session({
    secret: "this is a very secret secret phrase",
    store: new LevelStore("./db/sessions"),
    resave: true,
    saveUninitialized: true
}));
app.set("views", __dirname + "/../views");
app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "/../node_modules/jquery/dist")));
app.use("/", express.static(path.join(__dirname, "/../node_modules/bootstrap/dist")));
/*
  Authentication
*/
const authRouter = express.Router();
authRouter.get("/login", function (req, res) {
    res.render("login");
});
authRouter.post("/login", function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect("/login");
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect("/");
        }
    });
});
authRouter.get("/signup", function (req, res) {
    res.render("signup");
});
authRouter.get("/logout", function (req, res) {
    if (req.session.loggedIn) {
        delete req.session.loggedIn;
        delete req.session.user;
    }
    res.redirect("/login");
});
app.use(authRouter);
const authMiddleware = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect("/login");
};
/*
  Root
*/
app.get("/", authMiddleware, (req, res) => {
    res.render("index", { name: req.session.username });
});
/*
  Users
*/
const userRouter = express.Router();
userRouter.get("/:username", function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
userRouter.post("/", function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
userRouter.delete("/:username", function (req, res, next) {
    dbUser.get(req.params.username, function (err) {
        if (err)
            next(err);
        res.status(200).send();
    });
});
app.use("/user", userRouter);
/*
  Metrics
*/
const metricsRouter = express.Router();
metricsRouter.use(function (req, res, next) {
    console.log("called metrics router");
    next();
});
metricsRouter.get("/:id", (req, res, next) => {
    dbMet.get(req.params.id, (err, result) => {
        if (err)
            next(err);
        if (result === undefined) {
            res.write("no result");
            res.send();
        }
        else
            res.json(result);
    });
});
metricsRouter.post("/:id", (req, res, next) => {
    dbMet.save(req.params.id, req.body, (err) => {
        if (err)
            next(err);
        res.status(200).send();
    });
});
metricsRouter.delete("/:id", (req, res, next) => {
    dbMet.remove(req.params.id, (err) => {
        if (err)
            next(err);
        res.status(200).send();
    });
});
app.use("/metrics", authMiddleware, metricsRouter);
/*
  Error handling
*/
app.use(function (err, req, res, next) {
    console.log("got an error");
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`server is listening on port ${port}`);
});
