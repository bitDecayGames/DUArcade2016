//<reference path="./definitions/node.d.ts"/>
//<reference path="./definitions/express.d.ts"/>
var bodyParser = require('body-parser');
var express = require("express");
var fs = require('fs');

var app = express();
var port = 3000;


const LEVEL_ROUTE:string = "/level/:name";
app.post(LEVEL_ROUTE, bodyParser.json(), function(req, res) {
    var levelName:string = req.params.name;
    var pathToFile:string = __dirname + "/../public/data/levels/" + levelName + ".json";
    var levelJson = req.body;
    fs.writeFile(pathToFile, JSON.stringify(levelJson, undefined, 4));
    res.send("/data/levels/" + levelName + ".json");
    res.end();
});


app.get("/data/levels/:name", function(req, res){ res.download(__dirname + "/../public/data/levels/" + req.params.name) });


app.use(express.static(__dirname + "/../public/"));

// handle any 404 requests
var routes = app._router.stack.filter(router => {return router.route}).map(router => {return router.route.stack.map(stack => {return `${stack.method.toUpperCase()} \t${router.route.path}`}).join("\n")}).join("\n");
app.use(function(req, res){
    res.status(404).contentType("text/plain").send(`Could not ${req.method} ${req.path}\nTry:\n\n${routes}`)
});
app.listen(port, function(){
    console.log(`Listening to port:${port}`);
    console.log(`Routes:\n${routes}`);
});
