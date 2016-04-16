class Stamp {
    private game:Phaser.Game;
    private input: Input;
    private callback:(sprite:Phaser.Sprite)=>void;
    private sprite: Phaser.Sprite;

    constructor(game: Phaser.Game, input: Input, sprite:Phaser.Sprite, callback:(sprite:Phaser.Sprite)=>void){
        this.game = game;
        this.input = input;
        this.sprite = sprite;
        this.callback = callback;
    }

    update(){
        if (this.input.isJustDown(InputType.ACTION) && this.callback) this.callback(this.game.add.sprite(this.sprite.x, this.sprite.y, this.sprite.name));
        this.sprite.x = this.game.input.x;
        this.sprite.y = this.game.input.y;
    }
}