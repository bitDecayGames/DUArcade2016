class Player {
    game: Phaser.Game;
    speed: number = 300;
    input: Input;
    sprite: Phaser.Sprite;
    moving: boolean;
    nextStep: number = 0;
    stepSpacing: number = 0.5;
    body: Phaser.Physics.P2.Body;

    constructor(game: Phaser.Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(0, 0, "apple");
        this.sprite.anchor.setTo(0, 1);
        this.sprite.scale.setTo(1, 2);
        this.body = this.game.physics.p2.createBody(0, 0, 10, true);
        this.body.setCircle(this.sprite.width / 2 + 2, 0, 0, 0);
    }

    update(){
        this.sprite.x = this.body.x - this.sprite.width / 2;
        this.sprite.y = this.body.y;
        this.body.setZeroVelocity();
        this.moving = false;

        if(this.input.isDown(InputType.UP)) {
            this.body.moveUp(this.speed);
            this.moving = true;
        }
        else if (this.input.isDown(InputType.DOWN)) {
            this.body.moveDown(this.speed);
            this.moving = true;
        }
        if(this.input.isDown(InputType.LEFT)) {
            this.body.moveLeft(this.speed);
            this.moving = true;
        }
        else if (this.input.isDown(InputType.RIGHT)) {
            this.body.moveRight(this.speed);
            this.moving = true;
        }
         this.maybePlayWalkSound()
    }

    maybePlayWalkSound() {
        if (this.moving &&  this.game.time.totalElapsedSeconds() > this.nextStep) {
            SoundUtil.playSound(this.game, 'step');
            this.nextStep = this.game.time.totalElapsedSeconds() + this.stepSpacing;
        }
    }
}