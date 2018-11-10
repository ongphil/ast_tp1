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
      variable_content = "En mettant le path '/hello' avec un paramètre 'name', 'Hello [name]' sera affiché. <br/>" +
      "Example : <a href='http://localhost:8080/hello?name=YourName'>http://localhost:8080/hello?name=YourName</a> affichera 'Hello YourName' <br/><br/>" +
      "En mettant le path '/hello', 'philippe' or 'Philippe' en paramètre de 'name', une courte présentation de l'auteur sera affichée. <br/>" +
      "Example : <a href='http://localhost:8080/hello?name=philippe'>http://localhost:8080/hello?name=philippe</a> <br/><br/>" +
      "Tout autre path affichera une erreur 404 avec '404 Page not found'";
    } else if (path === "/hello" && (params["name"] === "philippe"||params["name"] === "Philippe")) {
      // short intro of yourself
      variable_content = "Je suis Ong Philippe, j'ai 22 ans. <br/>" +
      "Je suis un étudiant ingénieur en dernière année à l'ECE Paris. Ma majeure s'intitule Objets Connectés, Réseaux et Services.";
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
