import express = require("express");
import { MetricsHandler, Metric } from "./metrics";
import bodyparser = require("body-parser");
import morgan = require("morgan");
import session = require("express-session");
import levelSession = require("level-session-store");
import { UserHandler, User } from "./users";
import path = require("path");

const LevelStore = levelSession(session);

const app = express();
const port: string = process.env.PORT || "8080";

const dbMet: MetricsHandler = new MetricsHandler("./db/metrics");
const dbUser: UserHandler = new UserHandler("./db/users");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use(morgan("dev"));

app.use(
  session({
    secret: "this is a very secret secret phrase",
    store: new LevelStore("./db/sessions"),
    resave: true,
    saveUninitialized: true
  })
);

app.set("views", __dirname + "/../views");
app.set("view engine", "ejs");

app.use(
  "/",
  express.static(path.join(__dirname, "/../node_modules/jquery/dist"))
);
app.use(
  "/",
  express.static(path.join(__dirname, "/../node_modules/bootstrap/dist"))
);

/*
  Authentication
*/

const authRouter = express.Router();

/// Affiche la page login
authRouter.get("/login", function(req: any, res: any) {
  res.render("login");
});

/// Procède à la connexion d'un utilisateur
authRouter.post("/login", function(req: any, res: any, next: any) {
  dbUser.get(req.body.username, function(err: Error | null, result?: User) {
    if (err) next(err);
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect("/login");
    } else {
      req.session.loggedIn = true;
      req.session.user = result;
      res.redirect("/");
    }
  });
});

/// Affiche la page d'inscription
authRouter.get("/signup", function(req: any, res: any) {
  res.render("signup");
});

/// Déconnecte l'utilisateur courant et redirige vers la page de login
authRouter.get("/logout", function(req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn;
    delete req.session.user;
  }
  res.redirect("/login");
});

app.use(authRouter);

const authMiddleware = function(req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next();
  } else res.redirect("/login");
};

/*
  Root
*/

app.get("/", authMiddleware, (req: any, res: any) => {
  res.render("index", { name: req.session.user.username });
});

/*
  Users
*/

const userRouter = express.Router();

/// Affiche un utilisateur
userRouter.get("/:username", function(req: any, res: any, next: any) {
  dbUser.get(req.params.username, function(err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found");
    } else res.status(200).json(result);
  });
});

/// Sauvegarde un utilisateur
userRouter.post("/", function(req: any, res: any, next: any) {
  dbUser.get(req.body.username, function(err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists");
    } else {
      dbUser.save(req.body, function(err: Error | null) {
        if (err) next(err);
        else res.status(201).send("user persisted");
      });
    }
  });
});

/// Supprime un utilisateur
userRouter.delete("/:username", function(req: any, res: any, next: any) {
  dbUser.get(req.params.username, function(err: Error | null) {
    if (err) next(err);
    res.status(200).send();
  });
});

app.use("/user", userRouter);

/*
  Metrics
*/

const metricsRouter = express.Router();
metricsRouter.use(function(req: any, res: any, next: any) {
  console.log("called metrics router");
  next();
});

/// Affiche tous les groupes de metrics d'un user
metricsRouter.get("/:username", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMet.getAllUserMetrics(
      req.params.username,
      (err: Error | null, result?: {}) => {
        if (err) next(err);
        if (result === undefined) {
          res.write("no result");
          res.send();
        } else res.json(result);
      }
    );
  } else {
    res
      .status(401)
      .send("Vous n'avez pas l'autorisation de lire les metrics d'autrui !");
  }
});

/// Affiche un groupe de metrics d'un user
metricsRouter.get("/:username/:id", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMet.getUserMetricsWithKey(
      req.params.username,
      req.params.id,
      (err: Error | null, result?: Metric[]) => {
        if (err) next(err);
        if (result === undefined) {
          res.write("no result");
          res.send();
        } else res.json(result);
      }
    );
  }
});

// Sauvegarde un groupe de metrics d'un user
metricsRouter.post("/:username", (req: any, res: any, next: any) => {
    dbMet.saveUserOneMetricWithKey(
      req.session.user.username,
      req.body.key,
      new Metric(`${new Date(req.body.timestamp).getTime()}`, req.body.value),
      (err: Error | null) => {
        if (err) next(err);
        res.status(200).send();
        res.redirect("/");
      }
    );
});

// Supprime un groupe de metrics d'un user
metricsRouter.delete("/:username/:id", (req: any, res: any, next: any) => {
  if (req.session.user.username === req.params.username) {
    dbMet.removeUserMetricsWithKey(
      req.params.username,
      req.params.id,
      (err: Error | null) => {
        if (err) next(err);
        res.status(200).send();
      }
    );
  }
});

app.use("/metrics", authMiddleware, metricsRouter);

/*
  Error handling
*/

app.use(function(err: Error, req: any, res: any, next: any) {
  console.log("got an error");
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`server is listening on port ${port}`);
});
