class DUArcade2016Game extends Phaser.State {
    level: TestRotationLevel;

    preload() {
        this.load.image('apple', '../img/apple.png');
        this.load.image('floor', '../img/floor.png');
        this.load.image('wall', '../img/wall.png');
    }

    create() {
        this.level = new TestRotationLevel(this.game);
    }

    update() {
        this.level.draw();
    }
}