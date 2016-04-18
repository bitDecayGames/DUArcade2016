class PaintBrush {
    private game:Phaser.Game;
    private input: Input;
    private callback:(sprites:Phaser.Sprite[])=>void;
    private spritePicker:ImageSelect;
    private currentSpriteStamp: Stamp;
    private sprites:Phaser.Sprite[] = [];
    private selectedSpriteIndex:number = -1;
    private selectedSpriteHighlightColor:number = Phaser.Color.getColor(255, 255, 100);

    private _isActive = false;

    private currentRotationRadians:number = 0;

    snap:number = 30;

    spriteLocations:string[][] = [];

    constructor(game: Phaser.Game, input: Input, spriteLocations:string[][]){
        this.game = game;
        this.input = input;
        this.spriteLocations = spriteLocations;
        this.spritePicker = new ImageSelect(game, input, spriteLocations);
    }

    create(){
        this.spritePicker.create();
    }

    enter(callback:(sprites:Phaser.Sprite[])=>void, sprites?:Phaser.Sprite[], rotationRadians?:number){
        this._isActive = true;
        this.callback = callback;
        if (sprites) this.sprites = sprites;
        if (rotationRadians != null) this.currentRotationRadians = rotationRadians;
        if (!this.spritePicker.isVisible()) this.openSpritePicker();
    }

    isActive(){return this._isActive}

    update(){
        if (this._isActive) {
            var curSprite = this.selectedSprite();
            var moveAmount = this.snap;
            if (!this.input.isDown(InputType.SHIFT)) moveAmount = 1;

            if (this.currentSpriteStamp && !this.spritePicker.isVisible()) this.currentSpriteStamp.update();

            if (this.spritePicker.isVisible()) this.spritePicker.update();
            else if (this.input.isJustDown(InputType.SPACE) && !this.spritePicker.isVisible()) this.openSpritePicker();
            else if (this.input.isJustDown(InputType.DELETE) && curSprite) this.deleteSelectedSprite();
            else if (this.input.isJustDown(InputType.ARROW_LEFT) && curSprite) curSprite.x -= moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_RIGHT) && curSprite) curSprite.x += moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_UP) && curSprite) curSprite.y -= moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_DOWN) && curSprite) curSprite.y += moveAmount;
            else if (this.input.isJustDown(InputType.LESS_THAN)) this.selectPrevSprite();
            else if (this.input.isJustDown(InputType.GREATER_THAN)) this.selectNextSprite();
            else if (this.input.isJustDown(InputType.PLUS)) this.moveSelectedSpriteForward();
            else if (this.input.isJustDown(InputType.MINUS)) this.moveSelectedSpriteBack();


            if (this.input.isJustDown(InputType.ESCAPE) && this.callback) {
                this._isActive = false;
                if (this.currentSpriteStamp) {
                    this.currentSpriteStamp.destroy();
                    this.currentSpriteStamp = null;
                }
                this.callback(this.sprites);
                this.callback = null;
            }
        }
    }

    private openSpritePicker(){
        if (this.currentSpriteStamp) {
            this.currentSpriteStamp.destroy();
            this.currentSpriteStamp = null;
        }
        this.spritePicker.enter(pickedSprite => {
            this.currentSpriteStamp = new Stamp(this.game, this.input, this.game.add.sprite(0, 0, pickedSprite.key), stampedSprite => {
                this.sprites.push(stampedSprite);
                this.selectLastSprite();
            }, this.currentRotationRadians);
        });
    }

    private selectedSprite():Phaser.Sprite {
        return this.sprites[this.selectedSpriteIndex];
    }

    private selectNextSprite(){
        if (this.selectedSpriteIndex + 1 < this.sprites.length) this.selectedSpriteIndex += 1
        this.highlightSelectedSprite();
    }

    private selectPrevSprite(){
        if (this.selectedSpriteIndex - 1 >= 0) this.selectedSpriteIndex -= 1
        this.highlightSelectedSprite();
    }

    private selectLastSprite(){
        this.selectedSpriteIndex = this.sprites.length - 1;
        this.highlightSelectedSprite();
    }

    private deleteSelectedSprite(){
        this.sprites.splice(this.selectedSpriteIndex, 1).forEach(s => s.kill());
    }

    private moveSelectedSpriteBack(){
        console.log("move back");
        if (this.selectedSpriteIndex - 1 >= 0) {
            var spr:Phaser.Sprite = this.sprites.splice(this.selectedSpriteIndex, 1)[0];
            this.selectedSpriteIndex -= 1;
            this.sprites.splice(this.selectedSpriteIndex, 0, spr);
            this.sprites.concat().reverse().forEach(s=>s.sendToBack())
        }
    }

    private moveSelectedSpriteForward(){
        console.log("move forward");
        if (this.selectedSpriteIndex + 1 < this.sprites.length) {
            var spr = this.sprites.splice(this.selectedSpriteIndex, 1)[0];
            spr.moveUp();
            this.selectedSpriteIndex += 1;
            this.sprites.splice(this.selectedSpriteIndex, 0, spr);
            this.sprites.concat().reverse().forEach(s=>s.sendToBack())
        }
    }

    private highlightSelectedSprite(){
        var curSprite = this.selectedSprite();
        this.sprites.forEach((s:Phaser.Sprite) => {
            if (s === curSprite) s.tint = this.selectedSpriteHighlightColor;
            else s.tint = 0xFFFFFF;
        });
    }
}