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