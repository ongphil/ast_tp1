const url = require("url");
const qs = require("querystring");

module.exports = {
  serverHandle: function(req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    res.writeHead(200, { "Content-Type": "text/html" });

    let variable_content = "404 Page not found";

    if (path === "/") {
      // explains how /hello works
      variable_content = "By setting '/hello' as path with a 'name' param, 'Hello [name]' will be printed. <br/>" +
      "Example : <a href='http://localhost:8080/hello?name=YourName'>http://localhost:8080/hello?name=YourName</a> will print 'Hello YourName' <br/><br/>" +
      "By setting '/hello' as path with 'philippe' or 'Philippe' in the 'name' param, a short introduction of me will be printed. <br/>" +
      "Example : <a href='http://localhost:8080/hello?name=philippe'>http://localhost:8080/hello?name=philippe</a> <br/><br/>" +
      "By setting in other path, a 404 code with a '404 Page not found' will be sent";
    } else if (path === "/hello" && (params["name"] === "philippe"||params["name"] === "Philippe")) {
      // short intro of yourself
      variable_content = "My name is Ong Philippe, I am 22 yo. <br/>" +
      "I am a engineering student in final year of master degree, specialized in IoT, networks and services";
    } else if (path === "/hello" && "name" in params) {
      variable_content = `Hello ${params["name"]}`;
    } else {
      res.writeHead(404);
    }

    let content =
      "<!DOCTYPE html>" +
      "<html>" +
      "    <head>" +
      '        <meta charset="utf-8" />' +
      "        <title>AST TP1</title>" +
      "    </head>" +
      "    <body>" +
      "         <p>" +
      variable_content +
      "</p>" +
      "    </body>" +
      "</html>";

    res.write(content);
    res.end();
  }
};
