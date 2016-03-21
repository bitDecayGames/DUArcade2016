class StartNewGame extends Phaser.State {
    create(){
        this.game.state.start("game");
    }
}