class Init extends Phaser.State {
    preload(){
        this.load.json('gameInfo', 'conf/game.json');
    }

    create(){
        this.game.state.start("menu");
    }
}