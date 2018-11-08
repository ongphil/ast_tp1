const url = require("url");
const qs = require("querystring");

module.exports = {
  serverHandle: function(req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    res.writeHead(200, { "Content-Type": "text/plain" });

    if (path === "/") {
      // explains how /hello works
      res.write("Fonctionnement de /hello");
    } else if (path === "/hello" && params["name"] === "philippe") {
      // short intro of yourself
      res.write("Introduction sur moi");
    } else if (path === "/hello" && "name" in params) {
      res.write(`Hello ${params["name"]}`);
    } else {
      res.writeHead(404);
      res.write("404 Page not found");
    }
    res.end();
  }
};
