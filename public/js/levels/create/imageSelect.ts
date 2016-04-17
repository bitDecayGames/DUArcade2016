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
    private selectRectGraphics:Phaser.Graphics;

    private lastOffset:Phaser.Point;

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
        this.selectRectGraphics = game.add.graphics(0, 0);
    }

    private cameraOffset():Phaser.Point{return new Phaser.Point(this.game.camera.position.x - this.game.width / 2, this.game.camera.position.y - this.game.height / 2)}

    create(){
        var cameraOffset = this.cameraOffset();
        var halfHeight = this.game.height / 2;
        var halfWidth = this.game.width / 2;
        this.spriteGroup = this.game.add.group();
        this.spriteLocations.forEach((location:string, index:number) => {
            var s = this.game.add.sprite((index * this.stepSize) + halfWidth + cameraOffset.x, halfHeight + cameraOffset.y, location, this.spriteGroup);
            s.anchor.set(0.5, 0.5);
            s.width = this.spriteSize;
            s.height = this.spriteSize;
            s.visible = false;
            this.sprites.push(s);
        });
        this.selectRect.x += cameraOffset.x;
        this.selectRect.y += cameraOffset.y;

        this.lastOffset = cameraOffset;
    }

    enter(callback:(selectedSprite:Phaser.Sprite)=>void){
        var cameraOffset = this.cameraOffset();
        var currentOffset = cameraOffset.clone().subtract(this.lastOffset.x, this.lastOffset.y);
        this.callback = callback;
        this.sprites.forEach(sprite => {
            sprite.visible = true;
            sprite.bringToTop();
            sprite.x += currentOffset.x;
            sprite.y += currentOffset.y;
        });
        this._isVisible = true;
        this.selectRect.x += currentOffset.x;
        this.selectRect.y += currentOffset.y;
        this.lastOffset = cameraOffset;
    }

    update(){
        this.drawSelectRect();
        if (this.isMoving) this.moving();
        else {
            if (this.input.isJustDown(InputType.ARROW_LEFT)) this.move(true);
            else if (this.input.isJustDown(InputType.ARROW_RIGHT)) this.move(false);
            else if ((this.input.isJustDown(InputType.SPACE) || this.input.isJustDown(InputType.ESCAPE)) && this.callback) {
                this._isVisible = false;
                this.clearSelectRect();
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

    private drawSelectRect(){
        this.selectRectGraphics.clear();
        this.selectRectGraphics.lineStyle(4, 0xFFFF00);
        this.selectRectGraphics.drawRect(this.selectRect.x, this.selectRect.y, this.selectRect.width, this.selectRect.height);
    }

    private clearSelectRect(){
        this.selectRectGraphics.clear();
    }
}