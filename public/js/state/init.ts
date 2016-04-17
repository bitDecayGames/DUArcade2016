class Init extends Phaser.State {
    preload(){
        this.load.json('gameInfo', 'conf/game.json');
        this.load.json('images', 'images');
    }

    create(){
        this.game.state.start("menu");
    }
}