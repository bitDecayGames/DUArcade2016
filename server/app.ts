//<reference path="./definitions/node.d.ts"/>
//<reference path="./definitions/express.d.ts"/>
var bodyParser = require('body-parser');
var express = require("express");
var fs = require('fs');

var app = express();
var port = 3000;

app.use(express.static(__dirname + "/../public/"));

// Post level file.
const LEVEL_ROUTE:String = "/level/:name";
app.post(LEVEL_ROUTE, bodyParser.json(), function(req, res) {
    var levelName:String = req.params.name;
    console.log(LEVEL_ROUTE.replace(":name", levelName));
    var pathToFile:String = __dirname + "/../public/data/levels/" + levelName + ".json";
    var levelJson = req.body;

    // Save the file.
    fs.writeFile(pathToFile, levelJson);

    // Return download link.
    res.download(pathToFile);
    res.end();
});

// handle any 404 requests
var routes = app._router.stack.filter(router => {return router.route}).map(router => {return router.route.stack.map(stack => {return `${stack.method.toUpperCase()} \t${router.route.path}`}).join("\n")}).join("\n");
app.use(function(req, res){
    res.status(404).contentType("text/plain").send(`Could not ${req.method} ${req.path}\nTry:\n\n${routes}`)
});
app.listen(port, function(){
    console.log(`Listening to port:${port}`);
    console.log(`Routes:\n${routes}`);
});
