class Player {
    game: Phaser.Game;
    speed: number = 200;
    input: Input;
    sprite: Phaser.Sprite;

    constructor(game: Phaser.Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(50, 50, "apple");
        this.sprite.anchor.setTo(0, 1);
        this.sprite.scale.setTo(1, 2);
        this.game.physics.p2.enable(this.sprite);
        this.sprite.body.setRectangle(this.sprite.width, this.sprite.height / 3, 0, this.sprite.height / 3, 0);
        this.sprite.body.damping = 0.99999;
        this.sprite.body.fixedRotation = true;
        this.sprite.body.debug = true;
    }

    update(){
        if(this.input.isDown(InputType.UP)) this.sprite.body.moveUp(this.speed);
        else if (this.input.isDown(InputType.DOWN)) this.sprite.body.moveDown(this.speed);
        if(this.input.isDown(InputType.LEFT)) this.sprite.body.moveLeft(this.speed);
        else if (this.input.isDown(InputType.RIGHT)) this.sprite.body.moveRight(this.speed);
    }
}