class CreateLevel extends Phaser.State {
    private myInput: Input;
    private floorBrush: PaintBrush;
    private wallBrush: PaintBrush;
    private obstacleBrush: PaintBrush;
    private drawRectangle: DrawRectangle;
    private drawLines: DrawLines;

    private editorStateIndex:number = 0;
    private editorStateActivated:boolean = false;


    private floorplanLines:MyDrawLines;
    private obstacleBodies:MyDrawRectangles;
    private floor:Phaser.Sprite[] = [];
    private obstacles:Phaser.Sprite[] = [];
    private north:Phaser.Sprite[] = [];
    private east:Phaser.Sprite[] = [];
    private south:Phaser.Sprite[] = [];
    private west:Phaser.Sprite[] = [];


    preload(){
        this.floorplanLines = new MyDrawLines(this.game, Phaser.Color.getColor(200, 55, 255));
        this.obstacleBodies = new MyDrawRectangles(this.game, Phaser.Color.getColor(253, 145, 10));

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
                    this.drawLines = new DrawLines(this.game, this.myInput, (lines)=>{
                        this.floorplanLines = lines;
                        this.drawLines = null;
                    }, this.floorplanLines);
                    break;
                case EditorState.FLOOR:
                    this.floorBrush.enter(sprites => {
                        this.floor = sprites;
                    }, this.floor);
                    break;
                case EditorState.OBSTACLES:
                    this.drawRectangle = new DrawRectangle(this.game, this.myInput, (rects)=>{
                        this.obstacleBodies = rects;
                        this.drawRectangle = null;
                    }, this.obstacleBodies);
                    break;
                case EditorState.SCENERY:
                    this.obstacleBrush.enter(sprites => {
                        this.obstacles = sprites;
                    }, this.obstacles);
                    break;
                case EditorState.NORTH:
                    this.wallBrush.enter(sprites => {
                        this.north = sprites;
                    }, this.north);
                    break;
                case EditorState.EAST:
                    this.wallBrush.enter(sprites => {
                        this.east = sprites;
                    }, this.east);
                    break;
                case EditorState.SOUTH:
                    this.wallBrush.enter(sprites => {
                        this.south = sprites;
                    }, this.south);
                    break;
                case EditorState.WEST:
                    this.wallBrush.enter(sprites => {
                        this.west = sprites;
                    }, this.west);
                    break;
            }
        }
        else if (this.myInput.isJustDown(InputType.LEFT) && this.editorStateIndex - 1 >= 0) this.editorStateIndex -= 1;
        else if (this.myInput.isJustDown(InputType.RIGHT) && this.editorStateIndex + 1 < EditorState.states.length) this.editorStateIndex += 1;

        if (this.myInput.isJustDown(InputType.ESCAPE)) {
            if (this.editorStateActivated) this.editorStateActivated = false;
            else this.download();
        }


        this.game.debug.text(EditorState.states[this.editorStateIndex] + (this.editorStateActivated ? " -active-" : ""), 0, 10, "white");

        this.drawInOrder();
    }

    private drawInOrder(){
        switch(EditorState.states[this.editorStateIndex]){
            case EditorState.NORTH:
                this.north.forEach(s => s.visible = true);
                this.east.forEach(s => s.visible = false);
                this.south.forEach(s => s.visible = false);
                this.west.forEach(s => s.visible = false);
                break;
            case EditorState.EAST:
                this.north.forEach(s => s.visible = false);
                this.east.forEach(s => s.visible = true);
                this.south.forEach(s => s.visible = false);
                this.west.forEach(s => s.visible = false);
                break;
            case EditorState.SOUTH:
                this.north.forEach(s => s.visible = false);
                this.east.forEach(s => s.visible = false);
                this.south.forEach(s => s.visible = true);
                this.west.forEach(s => s.visible = false);
                break;
            case EditorState.WEST:
                this.north.forEach(s => s.visible = false);
                this.east.forEach(s => s.visible = false);
                this.south.forEach(s => s.visible = false);
                this.west.forEach(s => s.visible = true);
                break;
            default:
                this.north.forEach(s => s.visible = false);
                this.east.forEach(s => s.visible = false);
                this.south.forEach(s => s.visible = false);
                this.west.forEach(s => s.visible = false);
                break;
        }

        var f = (s:Phaser.Sprite)=>{s.sendToBack()};
        this.north.forEach(f);
        this.east.forEach(f);
        this.south.forEach(f);
        this.west.forEach(f);
        this.obstacles.forEach(f);
        this.floor.forEach(f);

    }

    download(){
        var serializeSprites = s=>{return {img: s.key, x: s.x, y: s.y, w: s.width, h: s.height}}

        var data = {
            name: "Test Level",
            camera:{
                follow: false,
                viewport: {
                    x: 0,
                    y: 0,
                    w: 200,
                    h: 200
                }
            },
            load:{
                imgs: this.floorBrush.spriteLocations.concat(this.wallBrush.spriteLocations).concat(this.obstacleBrush.spriteLocations).filter((value:string, index:number, self:string[])=>{return self.indexOf(value) === index})
            },
            floorplan: {
                outline: this.floorplanLines.points.map(p => {return {x: p.x, y: p.y}}),
                obstacles: this.obstacleBodies.rects.map(r => {return {x: r.x, y: r.y, w: r.width, h: r.height}}),
                floor: this.floor.map(serializeSprites),
                scenery: this.obstacles.map(serializeSprites)
            },
            north: {
                scenery: this.north.map(serializeSprites)
            },
            east: {
                scenery: this.east.map(serializeSprites)
            },
            south: {
                scenery: this.south.map(serializeSprites)
            },
            west: {
                scenery: this.west.map(serializeSprites)
            }
        };

        var $:any = window["$"]; // jquery
        $.ajax({
            method: "POST",
            url: "/level/" + data.name,
            success: (result) => {
                console.log("Result: " + result);
            }
        });
    }
}