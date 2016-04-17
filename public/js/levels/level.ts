class Level {
    private game: Phaser.Game;
    private myInput: Input;
    public player: Player;

    private data: LevelData;
    private sprites: Phaser.Sprite[];
    private orderedFadingRenderGroup: Phaser.Group;
    private floorbodies: Phaser.Group;
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
        this.player.body.x = 200;
        this.player.body.y = 175;
        this.orderedFadingRenderGroup.add(this.player.sprite);
        this.game.camera.follow(this.player.sprite);

        this.sprites = [];
        this.data.floorplan.floor.forEach((s)=>{
            s.sprite = this.game.add.sprite(s.x, s.y, s.img);
            s.sprite.width = s.width;
            s.sprite.height = s.height;
            s.sprite.rotation = Phaser.Math.degToRad(s.rotation);
            this.sprites.push(s.sprite);
            this.game.world.sendToBack(s.sprite);
        });
        this.data.getScenery().forEach((s)=>{
            s.sprite = this.game.add.sprite(s.x, s.y, s.img, 0, this.orderedFadingRenderGroup);
            s.sprite.width = s.width;
            s.sprite.height = s.height;
            s.sprite.rotation = Phaser.Math.degToRad(s.rotation);
            s.sprite.alpha = 0;
            this.sprites.push(s.sprite);
        });

        this.floorbodies = this.game.add.physicsGroup(Phaser.Physics.P2JS);
        this.data.floorplan.outline.forEach((lastPoint, index)=>{
            var curPoint = (index + 1 === this.data.floorplan.outline.length ? this.data.floorplan.outline[0] : this.data.floorplan.outline[index + 1]);

            var distance = Phaser.Math.distance(lastPoint.x, lastPoint.y, curPoint.x, curPoint.y);
            var zeroedCurPoint = curPoint.clone().subtract(lastPoint.x, lastPoint.y);
            var midPoint = zeroedCurPoint.clone().multiply(0.5, 0.5).add(lastPoint.x, lastPoint.y);
            var dirNorm = zeroedCurPoint.clone().normalize();
            var rotation = Phaser.Math.radToDeg(Phaser.Math.angleBetween(0, 0, dirNorm.x, dirNorm.y));

            var body = this.floorbodies.create(midPoint.x, midPoint.y);
            body.body.setRectangle(distance, 10, 0, 0);
            body.body.angle = rotation;
            //body.body.debug = true;
            body.body.static = true;
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

        var p = new Phaser.Point(this.player.body.x, this.player.body.y);
        p.rotate(center.x, center.y, this.DEGREES_PER_STEP, true);
        this.player.body.x = p.x;
        this.player.body.y = p.y;

        this.floorbodies.forEach((body:any)=>{
            var p = new Phaser.Point(body.body.x, body.body.y);
            p.rotate(center.x, center.y, this.DEGREES_PER_STEP, true);
            console.log("Rotate body: " + Object.keys(body));
            body.body.x = p.x;
            body.body.y = p.y;
            body.body.rotation += this.RADIANS_PER_STEP;
        }, this);

        this.FRAMES_TO_CHANGE_STATE -= 1;
        if (this.FRAMES_TO_CHANGE_STATE <= 0){
            this.FRAMES_TO_CHANGE_STATE = this.TOTAL_FRAMES_TO_CHANGE_STATE;
            this.isCurrentlyRotating = false;
        }
    }

    update(){
        this.myInput.update();
        this.player.update();

        var playerBottomEdge = this.player.sprite.y + (this.player.sprite.height * (1 - this.player.sprite.anchor.y));
        this.data.getCurrentDirection().scenery.forEach((s)=>{
            var sBottomEdge = s.sprite.y + (s.sprite.height * (1 - s.sprite.anchor.y));
            if (playerBottomEdge < sBottomEdge && this.player.sprite.overlap(s.sprite)){
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
            var aBottomEdge = a.y + (a.height * (1 - a.anchor.y));
            var bBottomEdge = b.y + (b.height * (1 - b.anchor.y));
            return (aBottomEdge < bBottomEdge ? -1 : 1);
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