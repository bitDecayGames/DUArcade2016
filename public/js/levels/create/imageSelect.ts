class ImageSelect {
    private game:Phaser.Game;
    private input:Input;
    private spriteLocations:string[];
    private sprites: Phaser.Sprite[] = [];
    private spriteGroup: Phaser.Group;
    private callback: (selectedSprite:Phaser.Sprite)=>void;
    private selectedSpriteIndex = 0;

    private isMoving:boolean = false;
    private isMovingLeft:boolean = false;
    private _isVisible = false;

    private spritesVisible = 5;
    private moveSpeedUpdateSteps = 5;
    private currentMoveStep = 0;
    private spriteSpacing = 50;
    private spriteSize:number;
    private stepSize:number;
    private moveStepSize:number;
    private selectRect:Phaser.Rectangle;

    constructor(game: Phaser.Game, input: Input, spriteLocations:string[]){
        this.game = game;
        this.input = input;
        this.spriteLocations = spriteLocations;
        this.spriteSize = (this.game.width - (this.spriteSpacing * (this.spritesVisible - 1))) / (this.spritesVisible - 1);
        this.stepSize = this.spriteSpacing + this.spriteSize;
        this.moveStepSize = this.stepSize / this.moveSpeedUpdateSteps;

        var halfHeight = this.game.height / 2;
        var halfWidth = this.game.width / 2;
        var rectSize = this.spriteSize + this.spriteSpacing / 2;
        var halfRectSize = rectSize / 2;
        this.selectRect = new Phaser.Rectangle(halfWidth - halfRectSize, halfHeight - halfRectSize, rectSize, rectSize);
        this.game.debug.geom(this.selectRect, "yellow", false);
    }

    preload(){
        this.spriteLocations.forEach((location:string) => {
            this.game.load.image(location, "/img/" + (location.indexOf(".") < 0 ? location + ".png" : location));
        });
    }

    create(){
        var halfHeight = this.game.height / 2;
        var halfWidth = this.game.width / 2;
        this.spriteGroup = this.game.add.group();
        this.spriteLocations.forEach((location:string, index:number) => {
            var s = this.game.add.sprite((index * this.stepSize) + halfWidth, halfHeight, location, this.spriteGroup);
            s.anchor.set(0.5, 0.5);
            s.width = this.spriteSize;
            s.height = this.spriteSize;
            s.visible = false;
            this.sprites.push(s);
        });
    }

    enter(callback:(selectedSprite:Phaser.Sprite)=>void){
        this.callback = callback;
        this.sprites.forEach(sprite => {
            sprite.visible = true;
            sprite.bringToTop()
        });
        this._isVisible = true;
    }

    update(){
        if (this.isMoving) this.moving();
        else {
            if (this.input.isJustDown(InputType.LEFT)) this.move(true);
            else if (this.input.isJustDown(InputType.RIGHT)) this.move(false);
            else if (this.input.isJustDown(InputType.ACTION) && this.callback) {
                this._isVisible = false;
                this.sprites.forEach(sprite => {
                    sprite.visible = false;
                    sprite.bringToTop()
                });
                this.callback(this.sprites[this.selectedSpriteIndex]);
            }
        }
    }

    isVisible():boolean { return this._isVisible }

    private move(isMovingLeft:boolean){
        if ((isMovingLeft && this.selectedSpriteIndex + 1 < this.sprites.length) ||
            (!isMovingLeft && this.selectedSpriteIndex - 1 >= 0)) {
            this.isMoving = true;
            this.isMovingLeft = isMovingLeft;
            this.selectedSpriteIndex += (isMovingLeft ? 1 : -1);
            this.currentMoveStep = 0;
        }
    }

    private moving(){
        if (this.currentMoveStep < this.moveSpeedUpdateSteps){
            this.sprites.forEach(sprite => {
                sprite.x += (this.isMovingLeft ? -this.moveStepSize : this.moveStepSize);
            });
            this.currentMoveStep += 1;
        } else this.isMoving = false;
    }
}