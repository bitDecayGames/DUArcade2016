class PaintBrush {
    private game:Phaser.Game;
    private input: Input;
    private callback:(sprites:Phaser.Sprite[])=>void;
    private spritePicker:ImageSelect;
    private currentSpriteStamp: Stamp;
    private sprites:Phaser.Sprite[] = [];

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
    }

    isActive(){return this._isActive}

    update(){
        if (this._isActive) {
            var moveAmount = this.snap;
            if (!this.input.isDown(InputType.SHIFT)) moveAmount = 1;

            if (this.currentSpriteStamp && !this.spritePicker.isVisible()) this.currentSpriteStamp.update();

            if (this.spritePicker.isVisible()) this.spritePicker.update();
            else if (this.input.isJustDown(InputType.SPACE) && !this.spritePicker.isVisible()) {
                if (this.currentSpriteStamp) {
                    this.currentSpriteStamp.destroy();
                    this.currentSpriteStamp = null;
                }
                this.spritePicker.enter(pickedSprite => {
                    this.currentSpriteStamp = new Stamp(this.game, this.input, this.game.add.sprite(0, 0, pickedSprite.key), stampedSprite => {
                        this.sprites.push(stampedSprite);
                    }, this.currentRotationRadians);
                });
            }
            else if (this.input.isJustDown(InputType.DELETE) && this.sprites.length > 0) {
                this.sprites.splice(this.sprites.length - 1, 1).forEach(s => s.kill());
            }
            else if (this.input.isJustDown(InputType.ARROW_LEFT) && this.sprites.length > 0) this.sprites[this.sprites.length - 1].x -= moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_RIGHT) && this.sprites.length > 0) this.sprites[this.sprites.length - 1].x += moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_UP) && this.sprites.length > 0) this.sprites[this.sprites.length - 1].y -= moveAmount;
            else if (this.input.isJustDown(InputType.ARROW_DOWN) && this.sprites.length > 0) this.sprites[this.sprites.length - 1].y += moveAmount;

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
}