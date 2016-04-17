class Stamp {
    private game:Phaser.Game;
    private input: Input;
    private callback:(sprite:Phaser.Sprite)=>void;
    private sprite: Phaser.Sprite;

    snap:number = 30;

    constructor(game: Phaser.Game, input: Input, sprite:Phaser.Sprite, callback:(sprite:Phaser.Sprite)=>void, rotationRadians?:number){
        this.game = game;
        this.input = input;
        this.sprite = sprite;
        this.callback = callback;
        if (rotationRadians != null) this.sprite.rotation = rotationRadians;
    }

    update(){
        if (this.input.isJustDown(InputType.CLICK) && this.callback) {
            var s = this.game.add.sprite(this.sprite.x, this.sprite.y, this.sprite.key);
            s.rotation = this.sprite.rotation;
            this.callback(s);
            this.sprite.bringToTop();
        }
        if (!this.input.isDown(InputType.SHIFT)){
            this.sprite.x = Math.round(this.game.input.x / this.snap) * this.snap;
            this.sprite.y = Math.round(this.game.input.y / this.snap) * this.snap;
        } else {
            this.sprite.x = this.game.input.x;
            this.sprite.y = this.game.input.y;
        }
    }

    destroy(){
        this.sprite.kill();
    }
}