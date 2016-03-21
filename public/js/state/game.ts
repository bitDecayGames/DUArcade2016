class DUArcade2016Game extends Phaser.State {
    player: Player;
    myInput: Input;
    preload() {
        this.load.image('apple', '../img/apple.png');
    }

    create() {
        this.myInput = new Input(this.game);
        this.player = new Player(this, this.myInput);
    }

    update() {
        this.myInput.update();
        this.player.update();
    }
}