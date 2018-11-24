"use strict";
express = require("express");
app = express();
app.set("port", 8080);
app.listen(app.get('port'), () => {
    console.log("Lancement sur le port 8080");
});
app.get("/", (req, res) => {
    res.status(200);
    // explains how /hello works
    const intro = "En mettant le path '/hello/:name', 'Hello [name]' sera affich&eacute;. <br/>" +
        "Example : <a href='http://localhost:8080/hello/YourName'>http://localhost:8080/hello/YourName</a> affichera 'Hello YourName' <br/><br/>" +
        "En mettant le path '/hello/philippe', une courte pr&eacute;sentation de l'auteur sera affich&eacute;e. <br/>" +
        "Example : <a href='http://localhost:8080/hello/philippe'>http://localhost:8080/hello/philippe</a> <br/><br/>" +
        "Tout autre path affichera une erreur 404 avec '404 Page not found'";
    res.send(intro);
});
app.get("/hello/:name", (req, res) => {
    res.status(200);
    if (req.params.name.toLowerCase() === "philippe") {
        const my_presentation = "Je suis Ong Philippe, j'ai 22 ans. <br/>" +
            "Je suis un &eacute;tudiant ing&eacute;nieur en dernière ann&eacute;e à l'ECE Paris. Ma majeure s'intitule Objets Connect&eacute;s, R&eacute;seaux et Services.";
        res.send(my_presentation);
    }
    else {
        res.send("Hello " + req.params.name);
    }
});
app.use(function (req, res) {
    res.status(404);
    res.send("404 Page not found");
});
