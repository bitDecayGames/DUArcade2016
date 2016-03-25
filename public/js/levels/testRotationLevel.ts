class TestRotationLevel {
    private game: Phaser.Game;
    private myInput: Input;
    private player: Player;
    private objs: Phaser.Sprite[];
    private currentlyFacing;
    private north: Phaser.Sprite[];
    private south: Phaser.Sprite[];
    private east: Phaser.Sprite[];
    private west: Phaser.Sprite[];
    private floor: Phaser.Sprite[];
    private renderGroup: Phaser.Group;
    private inFaceChangingState: boolean = false;
    private totalFramesToChangeState: number = 10;
    private framesToChangeState: number = this.totalFramesToChangeState;
    private fadeAmount: number = 0.05;

    constructor(game: Phaser.Game){
        this.game = game;
        this.myInput = new Input(this.game);

        this.floor = [];
        this.floor.push(this.game.add.sprite(100, 200, "floor"));
        this.floor.push(this.game.add.sprite(100, 300, "floor"));
        this.floor.push(this.game.add.sprite(200, 200, "floor"));
        this.floor.push(this.game.add.sprite(200, 300, "floor"));
        this.floor.push(this.game.add.sprite(300, 200, "floor"));
        this.floor.push(this.game.add.sprite(300, 300, "floor"));
        this.floor.forEach((sprite) => {
            sprite.anchor.setTo(0, 1);
            sprite.x += 150;
            sprite.y += 150;
        });

        this.renderGroup = this.game.add.group();

        this.player = new Player(this.game, this.myInput);
        this.player.sprite.x = 300;
        this.player.sprite.y = 300;
        this.renderGroup.add(this.player.sprite);

        this.north = [];
        this.south = [];
        this.east = [];
        this.west = [];

        this.north.push(this.game.add.sprite(100, 100, "wall"));
        this.north.push(this.game.add.sprite(200, 100, "wall"));
        this.north.push(this.game.add.sprite(300, 100, "wall"));
        this.north.push(this.game.add.sprite(100, 300, "wall"));
        this.north.push(this.game.add.sprite(200, 300, "wall"));
        this.north.push(this.game.add.sprite(300, 300, "wall"));

        this.south.push(this.game.add.sprite(200, 100, "wall"));
        this.south.push(this.game.add.sprite(300, 100, "wall"));
        this.south.push(this.game.add.sprite(400, 100, "wall"));
        this.south.push(this.game.add.sprite(200, 300, "wall"));
        this.south.push(this.game.add.sprite(300, 300, "wall"));
        this.south.push(this.game.add.sprite(400, 300, "wall"));
        this.south.forEach((sprite)=>{sprite.rotation = Math.PI});

        this.west.push(this.game.add.sprite(100, 100, "wall"));
        this.west.push(this.game.add.sprite(100, 200, "wall"));
        this.west.push(this.game.add.sprite(400, 100, "wall"));
        this.west.push(this.game.add.sprite(400, 200, "wall"));
        this.west.forEach((sprite) => {sprite.rotation = Math.PI / 2});

        this.east.push(this.game.add.sprite(100, 200, "wall"));
        this.east.push(this.game.add.sprite(100, 300, "wall"));
        this.east.push(this.game.add.sprite(400, 200, "wall"));
        this.east.push(this.game.add.sprite(400, 300, "wall"));
        this.east.forEach((sprite) => {sprite.rotation = -Math.PI / 2});

        this.objs = this.north.concat(this.south).concat(this.east).concat(this.west);

        this.objs.forEach((sprite) => {
            sprite.anchor.setTo(0, 1);
            sprite.x += 150;
            sprite.y += 150;
            this.renderGroup.add(sprite);
        });

        this.currentlyFacing = [
            {
                active: true,
                sprites: this.north
            },
            {
                active: false,
                sprites: this.east
            },
            {
                active: false,
                sprites: this.south
            },
            {
                active: false,
                sprites: this.west
            }
        ];
    }

    changeFacing(){
        var center = new Phaser.Point(this.game.width/2, this.game.height/2);
        var totalSteps = this.totalFramesToChangeState;
        function rotateSprite(sprite){
            var p = new Phaser.Point(sprite.x, sprite.y);
            p.rotate(center.x, center.y, 90 / totalSteps, true);
            sprite.x = p.x;
            sprite.y = p.y;
            sprite.rotation += Math.PI/2/totalSteps;
        }
        this.floor.forEach(rotateSprite);
        this.objs.forEach(rotateSprite);

        var p = new Phaser.Point(this.player.sprite.x, this.player.sprite.y);
        p.rotate(center.x, center.y, 90/totalSteps, true);
        this.player.sprite.x = p.x;
        this.player.sprite.y = p.y;

        this.framesToChangeState -= 1;
        if (this.framesToChangeState <= 0){
            this.framesToChangeState = this.totalFramesToChangeState;
            this.inFaceChangingState = false;
        }
    }

    draw(){
        this.myInput.update();
        this.player.update();

        this.currentlyFacing.forEach((facing)=>{
            if (facing.active) {
                facing.sprites.forEach((sprite: Phaser.Sprite) => {
                    if (this.player.sprite.y < sprite.y && this.player.sprite.overlap(sprite)){
                        sprite.alpha -= this.fadeAmount;
                        if (sprite.alpha <= 0.3) sprite.alpha = 0.3;
                    } else {
                        sprite.alpha += this.fadeAmount;
                        if (sprite.alpha >= 1) sprite.alpha = 1;
                    }
                });
            } else {
                facing.sprites.forEach((sprite: Phaser.Sprite) => {
                    sprite.alpha -= this.fadeAmount;
                    if (sprite.alpha <= 0) sprite.alpha = 0;
                });
            }
        });
        this.renderGroup.sort("y", Phaser.Group.SORT_ASCENDING);

        if (!this.inFaceChangingState && this.myInput.isJustDown(InputType.ACTION)) {
            this.inFaceChangingState = true;
            var switchedFacing = false;
            this.currentlyFacing.forEach((facing, index) => {
                if (!switchedFacing && facing.active){
                    facing.active = false;
                    if (index + 1 === this.currentlyFacing.length) this.currentlyFacing[0].active = true;
                    else this.currentlyFacing[index + 1].active = true;
                    switchedFacing = true;
                }
            });
        }
        if (this.inFaceChangingState){
            this.changeFacing();
        }
    }
}