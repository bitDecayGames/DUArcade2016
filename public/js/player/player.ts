class Player {
    WALK_FRAME_RATE:number = 10;

    game: Phaser.Game;
    speed: number = 300;
    input: Input;
    sprite: Phaser.Sprite;
    moving: boolean;
    facing: string = Facing.SOUTH;
    nextStep: number = 0;
    stepSpacing: number = 0.5;
    body: Phaser.Physics.P2.Body;

    followingText: FollowingText;

    walkNorth: Phaser.Animation;
    walkSouth:Phaser.Animation;
    walkEast:Phaser.Animation;
    walkWest:Phaser.Animation;

    constructor(game: Phaser.Game, input: Input){
        this.game = game;
        this.input = input;

        this.sprite = game.add.sprite(0, 0, "playerSheet", 8);
        this.sprite.anchor.setTo(0, 1);
        this.sprite.scale.setTo(1, 1);

        this.walkEast = this.sprite.animations.add(Facing.EAST, [0, 1, 2, 3], this.WALK_FRAME_RATE);
        this.walkWest = this.sprite.animations.add(Facing.WEST, [4, 5, 6, 7], this.WALK_FRAME_RATE);
        this.walkSouth = this.sprite.animations.add(Facing.SOUTH, [8, 9, 10, 11], this.WALK_FRAME_RATE);
        this.walkNorth = this.sprite.animations.add(Facing.NORTH, [12, 13, 14, 15], this.WALK_FRAME_RATE);

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
            this.facing = Facing.NORTH;
            this.moving = true;
        }
        else if (this.input.isDown(InputType.DOWN)) {
            this.body.moveDown(this.speed);
            this.facing = Facing.SOUTH;
            this.moving = true;
        }
        if(this.input.isDown(InputType.LEFT)) {
            this.body.moveLeft(this.speed);
            this.facing = Facing.WEST;
            this.moving = true;
        }
        else if (this.input.isDown(InputType.RIGHT)) {
            this.body.moveRight(this.speed);
            this.facing = Facing.EAST;
            this.moving = true;
        }

        if (this.moving) {
            switch (this.facing) {
                case Facing.NORTH:
                    if (!this.walkNorth.isPlaying) {
                        this.stopAllAnimations();
                        this.walkNorth.play();
                    }
                    break;
                case Facing.SOUTH:
                    if (!this.walkSouth.isPlaying) {
                        this.stopAllAnimations();
                        this.walkSouth.play();
                    }
                    break;
                case Facing.WEST:
                    if (!this.walkWest.isPlaying) {
                        this.stopAllAnimations();
                        this.walkWest.play();
                    }
                    break;
                case Facing.EAST:
                    if (!this.walkEast.isPlaying) {
                        this.stopAllAnimations();
                        this.walkEast.play();
                    }
                    break;
            }
        } else {
            switch (this.facing) {
                case Facing.NORTH:
                    this.walkNorth.stop(true)
                    break;
                case Facing.SOUTH:
                    this.walkSouth.stop(true);
                    break;
                case Facing.WEST:
                    this.walkWest.stop(true);
                    break;
                case Facing.EAST:
                    this.walkEast.stop(true);
                    break;
            }
        }

        this.maybePlayWalkSound();

        if (this.followingText) {
            this.followingText.update();
        }
    }

    setFollowingText(text: FollowingText) {
        this.followingText = text;
    }

    clearFollowingText() {
        this.followingText = null;
    }

    maybePlayWalkSound() {
        if (this.moving &&  this.game.time.totalElapsedSeconds() > this.nextStep) {
            SoundUtil.playSound(this.game, 'step');
            this.nextStep = this.game.time.totalElapsedSeconds() + this.stepSpacing;
        }
    }

    stopAllAnimations() {
        this.walkNorth.stop(true);
        this.walkSouth.stop(true);
        this.walkWest.stop(true);
        this.walkEast.stop(true);
    }
}