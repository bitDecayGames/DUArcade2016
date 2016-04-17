//<reference path="./definitions/node.d.ts"/>
//<reference path="./definitions/express.d.ts"/>
var bodyParser = require('body-parser');
var cons = require('consolidate')
var express = require("express");
var fs = require('fs');
var recursive = require('recursive-readdir');

const GET:string = "GET ";
const POST:string = "POST ";

var app = express();
var port = 3000;


// Level endpoints
const LEVEL_ROUTE:string = "/level/:name";
app.post(LEVEL_ROUTE, bodyParser.json(), function(req, res) {
    var levelName:string = req.params.name;
    console.log(POST + LEVEL_ROUTE.replace(":name", levelName));

    var pathToBuildFile:string = "/../public/data/levels/" + levelName + ".json";
    var pathToRepoFile:string = "/.." + pathToBuildFile;

    var levelJson = JSON.stringify(req.body, undefined, 4);
    fs.writeFile(__dirname +  + pathToBuildFile, levelJson);
    fs.writeFile(__dirname + pathToRepoFile, levelJson);

    res.send("/data/levels/" + levelName + ".json");
    res.end();
});

const LEVEL_DOWNLOAD_ROUTE:string = "/data/levels/:name";
app.get(LEVEL_DOWNLOAD_ROUTE, function(req, res) {
    var levelName:string = req.params.name;
    console.log(GET + LEVEL_ROUTE.replace(":name", levelName));

    res.download(__dirname + "/../public/data/levels/" + levelName)
});

// Bulk asset endpoints
const ASSET_ROUTE:string = "/assets/:dirName";
const ASSET_DIR:string  = __dirname + "/../public/";
/*
 * Gets all assets in the specified public directory.
 *
 * Use ':' instead of '/' for dirName to go into sub directories.
 *
 * Return format is:
 * {
 *      assets: [
 *           {
 *              name: 'foo',
 *              path: 'img/bar/foo.type'
 *           }
 *      ]
 * }
 */
app.get(ASSET_ROUTE, bodyParser.json(), function(req, res) {
    var dirName:string = req.params.dirName.replace(":", "/");

    console.log(GET + ASSET_ROUTE.replace(":dirName", dirName));

    recursive(ASSET_DIR + dirName, function (err, files) {
        var fileJson = {
            assets: []
        };

        files.forEach((filePath:string) => {
            var strippedPath:string = filePath.substr(filePath.indexOf(dirName));
            var name:string = strippedPath.substr(strippedPath.lastIndexOf("/") + 1);
            name = name.substr(0, name.lastIndexOf("."));

            fileJson.assets.push(
                {
                    name: name,
                    path: strippedPath
                }
            );
        });

        res.send(JSON.stringify(fileJson, undefined, 4));
        res.end();
    });
});

// Templating
app.engine("html", cons.mustache);
app.set("view engine", "html");
app.set("views", __dirname + "/../public/views");

const SCRIPT_DIR:string = __dirname + "/../public/js";
app.get('/', function (req, res) {
    console.log(GET + "/views/index.html");

    var scriptList = [];

    // Get all js files.
    recursive(SCRIPT_DIR, function (err, files) {
        files.forEach((filePath:string) => {
            if (filePath.indexOf(".map") < 0) {
                var path:string = filePath.substr(filePath.indexOf('js'));
                scriptList.push(
                    {
                        scriptPath: path
                    }
                );
            }
        });

        res.render("index.html", {
            scripts: scriptList
        });
    });
});

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
