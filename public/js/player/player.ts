class Player {
    game: Phaser.Game;
    speed: number = 1;
    input: Input;
    sprite: Phaser.Sprite;

    constructor(game: Phaser.Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(0, 0, "apple");
        this.sprite.anchor.setTo(0, 1);
        this.sprite.scale.setTo(1, 2);
    }

    update(){
        if(this.input.isDown(InputType.UP)) this.sprite.y -= this.speed;
        else if (this.input.isDown(InputType.DOWN)) this.sprite.y += this.speed;
        if(this.input.isDown(InputType.LEFT)) this.sprite.x -= this.speed;
        else if (this.input.isDown(InputType.RIGHT)) this.sprite.x += this.speed;
    }
}