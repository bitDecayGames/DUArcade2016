class CreateLevel extends Phaser.State {
    private myInput: Input;
    private floorImages: ImageSelect;
    private wallImages: ImageSelect;
    private obstacleImages: ImageSelect;
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
        this.floorImages = new ImageSelect(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.floorImages.preload();
        this.wallImages = new ImageSelect(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.wallImages.preload();
        this.obstacleImages = new ImageSelect(this.game, this.myInput, [
            "apple",
            "button_sprite_sheet",
            "floor",
            "placeholder-background.jpg",
            "wall"
        ]);
        this.obstacleImages.preload();
    }

    create(){
        this.floorImages.create();
        this.wallImages.create();
        this.obstacleImages.create();
    }

    update(){
        this.myInput.update();

        if (this.floorImages.isVisible()) this.floorImages.update();
        else if (this.wallImages.isVisible()) this.wallImages.update();
        else if (this.obstacleImages.isVisible()) this.obstacleImages.update();
        else if (this.drawRectangle) this.drawRectangle.update();
        else if (this.drawLines) this.drawLines.update();
        else if (this.myInput.isJustDown(InputType.ENTER)) {
            this.editorStateActivated = true;
            var state = EditorState.states[this.editorStateIndex];
            switch(state){
                case EditorState.FLOORPLAN:
                    if (this.floorplanGraphics) this.floorplanGraphics.clear();
                    this.drawLines = new DrawLines(this.game, this.myInput, (points, graphics)=>{
                        this.floorplan = points;
                        this.floorplanGraphics = graphics;
                        this.drawLines = null;
                    }, Phaser.Color.getColor(200, 55, 255));
                    break;
                case EditorState.FLOOR:
                    this.floorImages.enter((sprites)=>{

                    });
                    break;
                case EditorState.OBSTACLES:
                    if (this.obstacleBodiesGraphics) this.obstacleBodiesGraphics.clear();
                    this.drawRectangle = new DrawRectangle(this.game, this.myInput, (rects, graphics)=>{
                        this.obstacleBodies = rects;
                        this.obstacleBodiesGraphics = graphics;
                        this.drawRectangle = null;
                    }, Phaser.Color.getColor(253, 145, 10));
                    break;
                case EditorState.SCENERY:
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

        this.game.debug.text(EditorState.states[this.editorStateIndex] + (this.editorStateActivated ? " -active-" : ""), 0, 50, "white");
    }
}