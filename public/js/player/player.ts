class Player {
    game: DUArcade2016Game;
    speed: number = 10;
    input: Input;
    sprite: Phaser.Sprite;

    constructor(game:DUArcade2016Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(100, 100, "apple");
        this.sprite.anchor.setTo(0.5, 0.5);
    }

    update(){
        if(this.input.isDown(InputType.UP)) this.sprite.y -= this.speed;
        else if (this.input.isDown(InputType.DOWN)) this.sprite.y += this.speed;
        if(this.input.isDown(InputType.LEFT)) this.sprite.x -= this.speed;
        else if (this.input.isDown(InputType.RIGHT)) this.sprite.x += this.speed;
    }
}