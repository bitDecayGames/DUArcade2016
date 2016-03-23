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

To install grunt, use command:
`npm install -g grunt-cli`

Followed by
`npm install`
to get it to make your newly installed packages usable.

This command sets up a watch on the files in /public and /server. Open a new command window and run this:
```grunt dev```

This command starts the node server app on [localhost:3000](http://localhost:3000).  You will need to open a different window than before and run this:
```node build/server/app.js```

Using these two commands, you will be able to make edits to the files in the /public directory and have them automatically refreshed.  All you have to do is refresh your browser to load them.  It also refreshes the files in the /server directory, but in order to see those changes you will have to manually ```Ctrl+C``` out of the node command and manually re-run it.

In intellij, you can set up a couple [Build Configurations](https://www.jetbrains.com/help/idea/15.0/creating-and-editing-run-debug-configurations.html?origin=old_help) for both of the above commands to allow you to run those commands from the IDE.  It also helps to restart the server because there is just a little "Rerun" button in the task bar and a hot-key (```⌘-R``` on Mac, probably ```ctrl-R``` on Win).

## Production

The master branch is deployed at [dev.bytebreakstudios.com:3000](http://dev.bytebreakstudios.com:3000)

## Info

* [Design Doc](https://docs.google.com/document/d/1Gxge2_8-U16DAEXcHfV73xlRAJmqlBCkBnh5tFU4vko/edit#)
 
