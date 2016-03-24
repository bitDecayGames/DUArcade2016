window.onload = () => {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, "content");

    game.state.add("init", new Init());
    game.state.add("menu", new Menu());
    game.state.add("credits", new Credits());
    game.state.add("options", new Options());
    game.state.add("new", new StartNewGame());
    game.state.add("load", new LoadExistingGame());
    game.state.add("game", new DUArcade2016Game());


    game.state.start("init");
};

/*
This function swallows the [SPACE], [UP], [DOWN], [LEFT], [RIGHT] keys so that the window
doesn't scroll around while people are trying to play the game.
 */
window.onkeydown = function(e) { return e.keyCode != 32 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40; };