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

    private mousePos():Phaser.Point{return new Phaser.Point((this.game.camera.position.x - this.game.width / 2) + this.game.input.x, (this.game.camera.position.y - this.game.height / 2) + this.game.input.y)}

    update(){
        if (this.input.isJustDown(InputType.CLICK) && this.callback) {
            var s = this.game.add.sprite(this.sprite.x, this.sprite.y, this.sprite.key);
            s.rotation = this.sprite.rotation;
            this.callback(s);
            this.sprite.bringToTop();
        }
        var mousePos = this.mousePos();
        if (this.input.isUp(InputType.SHIFT)){
            this.sprite.x = Math.round(mousePos.x / this.snap) * this.snap;
            this.sprite.y = Math.round(mousePos.y / this.snap) * this.snap;
        } else {
            this.sprite.x = mousePos.x;
            this.sprite.y = mousePos.y;
        }
    }

    destroy(){
        this.sprite.kill();
    }
}