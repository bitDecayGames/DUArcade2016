class Player {
    game: Phaser.Game;
    speed: number = 1;
    input: Input;
    sprite: Phaser.Sprite;
    moving: boolean;
    nextStep: number = 0;
    stepSpacing: number = 0.5;

    constructor(game: Phaser.Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(0, 0, "apple");
        this.sprite.anchor.setTo(0, 1);
        this.sprite.scale.setTo(1, 2);

        this.moving = false;
    }

    update(){

        this.moving = false;

        if(this.input.isDown(InputType.UP)) {
            this.sprite.y -= this.speed;
            this.moving = true;
        }
        else if (this.input.isDown(InputType.DOWN)) {
            this.sprite.y += this.speed;
            this.moving = true;
        }
        if(this.input.isDown(InputType.LEFT)) {
            this.sprite.x -= this.speed;
            this.moving = true;
        }
        else if (this.input.isDown(InputType.RIGHT)) {
            this.sprite.x += this.speed;
            this.moving = true;
        }

        this.maybePlayWalkSound()
    }

    maybePlayWalkSound() {
        if (this.moving &&  this.game.time.totalElapsedSeconds() > this.nextStep) {
            this.game.sound.play('step');
            this.nextStep = this.game.time.totalElapsedSeconds() + this.stepSpacing;
        }
    }
}