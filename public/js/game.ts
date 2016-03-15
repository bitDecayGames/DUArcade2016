class DUArcade2016Game {
    game:Phaser.Game;
    apple:Phaser.Sprite;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload() {
        this.game.load.image('apple', '../img/apple.png');
    }

    create() {
        this.apple = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'apple');
        this.apple.anchor.setTo(0.5, 0.5);
    }

    update() {
        this.apple.position.x = this.game.input.mousePointer.x;
        this.apple.position.y = this.game.input.mousePointer.y;
    }
}