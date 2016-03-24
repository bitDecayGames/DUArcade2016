class DUArcade2016Game extends Phaser.State {
    player: Player;
    myInput: Input;

    level: TestRotationLevel;

    preload() {
        this.load.image('apple', '../img/apple.png');
    }

    create() {
        this.myInput = new Input(this.game);
        this.player = new Player(this, this.myInput);

        this.level = new TestRotationLevel();
    }

    update() {
        this.myInput.update();
        this.player.update();

        this.level.draw(this.game);
    }
}