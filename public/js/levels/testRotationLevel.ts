class Level {
    private game: Phaser.Game;
    private myInput: Input;
    private player: Player;

    private data: LevelData;
    private sprites: Phaser.Sprite[];
    private orderedFadingRenderGroup: Phaser.Group;
    private isCurrentlyRotating: boolean = false;

    private TOTAL_FRAMES_TO_CHANGE_STATE: number = 10;
    private DEGREES_PER_STEP: number = 90 / this.TOTAL_FRAMES_TO_CHANGE_STATE;
    private RADIANS_PER_STEP: number = Math.PI / 2 / this.TOTAL_FRAMES_TO_CHANGE_STATE;
    private FRAMES_TO_CHANGE_STATE: number = this.TOTAL_FRAMES_TO_CHANGE_STATE;
    private FADE_AMOUNT: number = 0.05;
    private MAX_FADE_AMOUNT: number = 0.3;

    constructor(game: Phaser.Game, data: LevelData){
        this.game = game;
        this.data = data;
        this.myInput = new Input(this.game);

        this.orderedFadingRenderGroup = this.game.add.group();

        this.player = new Player(this.game, this.myInput);
        this.player.sprite.x = 300;
        this.player.sprite.y = 300;
        this.orderedFadingRenderGroup.add(this.player.sprite);

        this.sprites = [];
        this.data.floorplan.scenery.forEach((s)=>{
            s.sprite = this.game.add.sprite(s.x, s.y, s.img);
            s.sprite.rotation = s.rotation;
            s.sprite.alpha = 0;
            this.sprites.push(s.sprite);
        });
        this.data.getScenery().forEach((s)=>{
            s.sprite = this.game.add.sprite(s.x, s.y, s.img);
            s.sprite.rotation = s.rotation;
            s.sprite.alpha = 0; // make everything visible
            this.orderedFadingRenderGroup.add(s.sprite);
            this.sprites.push(s.sprite);
        });
    }

    changeFacing(){
        var center = new Phaser.Point(this.game.width/2, this.game.height/2);
        this.sprites.forEach((sprite)=>{
            var p = new Phaser.Point(sprite.x, sprite.y);
            p.rotate(center.x, center.y, this.DEGREES_PER_STEP, true);
            sprite.x = p.x;
            sprite.y = p.y;
            sprite.rotation += this.RADIANS_PER_STEP;
        });

        var p = new Phaser.Point(this.player.sprite.x, this.player.sprite.y);
        p.rotate(center.x, center.y, this.DEGREES_PER_STEP, true);
        this.player.sprite.x = p.x;
        this.player.sprite.y = p.y;

        this.FRAMES_TO_CHANGE_STATE -= 1;
        if (this.FRAMES_TO_CHANGE_STATE <= 0){
            this.FRAMES_TO_CHANGE_STATE = this.TOTAL_FRAMES_TO_CHANGE_STATE;
            this.isCurrentlyRotating = false;
        }
    }

    draw(){
        this.myInput.update();
        this.player.update();



        this.data.getCurrentDirection().scenery.forEach((s)=>{
            if (this.player.sprite.y < s.sprite.y && this.player.sprite.overlap(s.sprite)){
                s.sprite.alpha -= this.FADE_AMOUNT;
                if (s.sprite.alpha <= this.MAX_FADE_AMOUNT) s.sprite.alpha = this.MAX_FADE_AMOUNT;
            } else {
                s.sprite.alpha += this.FADE_AMOUNT;
                if (s.sprite.alpha >= 1) s.sprite.alpha = 1;
            }
        });
        this.data.getOtherDirections().forEach((dir)=>{dir.scenery.forEach((s)=>{
            s.sprite.alpha -= this.FADE_AMOUNT;
            if (s.sprite.alpha < 0) s.sprite.alpha = 0;
        })});

        this.orderedFadingRenderGroup.customSort((a, b)=>{
            return (a.y + a.height < b.y + b.height ? -1 : 1);
        });

        if (!this.isCurrentlyRotating && this.myInput.isJustDown(InputType.ACTION)) {
            this.isCurrentlyRotating = true;
            this.data.rotateRight();
        }
        if (this.isCurrentlyRotating){
            this.changeFacing();
        }
    }
}