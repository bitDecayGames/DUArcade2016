class CreateLevel extends Phaser.State {
    private myInput: Input;
    private floorBrush: PaintBrush;
    private wallBrush: PaintBrush;
    private obstacleBrush: PaintBrush;
    private drawRectangle: DrawRectangle;
    private drawLines: DrawLines;
    private spriteStamp:Stamp;

    private editorStateIndex:number = 0;
    private editorStateActivated:boolean = false;

    private floorplan:Phaser.Point[] = [];
    private floorplanGraphics:Phaser.Graphics;
    private obstacleBodies:Phaser.Rectangle[] = [];
    private obstacleBodiesGraphics:Phaser.Graphics;
    private obstacles:Phaser.Sprite[] = [];
    private floor:Phaser.Sprite[] = [];
    private north:Phaser.Sprite[] = [];
    private south:Phaser.Sprite[] = [];
    private east:Phaser.Sprite[] = [];
    private west:Phaser.Sprite[] = [];


    preload(){
        this.myInput = new Input(this.game);
        this.floorBrush = new PaintBrush(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.floorBrush.preload();
        this.wallBrush = new PaintBrush(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.wallBrush.preload();
        this.obstacleBrush = new PaintBrush(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.obstacleBrush.preload();
    }

    create(){
        this.floorBrush.create();
        this.wallBrush.create();
        this.obstacleBrush.create();
    }

    update(){
        this.myInput.update();

        if (this.floorBrush.isActive()) this.floorBrush.update();
        else if (this.wallBrush.isActive()) this.wallBrush.update();
        else if (this.obstacleBrush.isActive()) this.obstacleBrush.update();
        else if (this.drawRectangle) this.drawRectangle.update();
        else if (this.drawLines) this.drawLines.update();
        else if (this.myInput.isJustDown(InputType.ENTER)) {
            this.editorStateActivated = true;
            var state = EditorState.states[this.editorStateIndex];
            switch(state){
                case EditorState.FLOORPLAN:
                    this.drawLines = new DrawLines(this.game, this.myInput, (points, graphics)=>{
                        this.floorplan = points;
                        this.floorplanGraphics = graphics;
                        this.drawLines = null;
                    }, Phaser.Color.getColor(200, 55, 255), this.floorplan, this.floorplanGraphics);
                    break;
                case EditorState.FLOOR:
                    this.floorBrush.enter(sprites => {
                        this.floor = sprites;
                    }, this.floor);
                    break;
                case EditorState.OBSTACLES:
                    this.drawRectangle = new DrawRectangle(this.game, this.myInput, (rects, graphics)=>{
                        this.obstacleBodies = rects;
                        this.obstacleBodiesGraphics = graphics;
                        this.drawRectangle = null;
                    }, Phaser.Color.getColor(253, 145, 10), this.obstacleBodies, this.obstacleBodiesGraphics);
                    break;
                case EditorState.SCENERY:
                    this.obstacleBrush.enter(sprites => {
                        this.obstacles = sprites;
                    }, this.obstacles);
                    break;
                case EditorState.NORTH:
                    break;
                case EditorState.EAST:
                    break;
                case EditorState.SOUTH:
                    break;
                case EditorState.WEST:
                    break;
            }
        }
        else if (this.myInput.isJustDown(InputType.LEFT) && this.editorStateIndex - 1 >= 0) this.editorStateIndex -= 1;
        else if (this.myInput.isJustDown(InputType.RIGHT) && this.editorStateIndex + 1 < EditorState.states.length) this.editorStateIndex += 1;

        if (this.myInput.isJustDown(InputType.ESCAPE)) this.editorStateActivated = false;

        this.game.debug.text(EditorState.states[this.editorStateIndex] + (this.editorStateActivated ? " -active-" : ""), 0, 10, "white");
    }
}