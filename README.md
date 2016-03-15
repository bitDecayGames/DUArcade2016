# DU Arcade 2016

## Initial Setup

Run ```npm install``` to have npm install all of the dependencies for this project.  (You will probably need to install grunt-cli globally)

## Main Dependencies

* [Npm](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/)
* [Grunt](http://gruntjs.com/)
* [Phaser.js](http://phaser.io/)


## Development
```
*assumes you have grunt-cli installed globally
*assumes you have node installed globally
```

This command sets up a watch on the files in /public and /server. Open a new command window and run this:
```grunt dev```

This command starts the node server app.  You will need to open a different window than before and run this:
```node build/server/app.js```

Using these two commands, you will be able to make edits to the files in the /public directory and have them automatically refreshed.  All you have to do is refresh your browser to load them.  It also refreshes the files in the /server directory, but in order to see those changes you will have to manually ```Ctrl+C``` out of the node command and manually re-run it.

## Production

The master branch is deployed at [dev.bytebreakstudios.com:3000](http://dev.bytebreakstudios.com:3000)