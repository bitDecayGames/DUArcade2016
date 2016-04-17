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
    private north:Phaser.Sprite[] = [];
    private east:Phaser.Sprite[] = [];
    private south:Phaser.Sprite[] = [];
    private west:Phaser.Sprite[] = [];

    private cameraSpeed = 5;


    preload(){
        this.game.world.setBounds(-1024, -1024, 2048, 2048);

        this.floorplanLines = new MyDrawLines(this.game, Phaser.Color.getColor(200, 55, 255));
        this.obstacleBodies = new MyDrawRectangles(this.game, Phaser.Color.getColor(253, 145, 10));

        this.myInput = new Input(this.game);
        this.floorBrush = new PaintBrush(this.game, this.myInput, [
            "large",
            "small",
            "rug_10",
            "rug_2",
            "rug_4",
            "rug_8",
            "rug_12",
            "rug_3",
            "rug_6",
            "rug_9",
            "rug_center"
        ]);

        // Get all walls out of the image json.
        // Some are not in the wall dir, list them manually for now.
        var wallAssets = [
            "4",
            "6",
            "8",
            "45_4",
            "45_8",
            "3060_4",
            "3060_8",
            "6030_4",
            "6030_8",
            "doorFrame_l",
            "doorFrame_l_edge",
            "doorFrame_r",
            "doorFrame_r_edge",
            "doorFrame_top",
            "fireplace",
            // walls are above this line, ceilings are below this line
            "3",
            "9",
            "12",
            "bl",
            "br",
            "tl",
            "tr",
            "10",
            "2",
            "45_10",
            "45_2",
            "3060_10",
            "3060_2",
            "6030_10",
            "6030_2"
        ];
        var images = AssetsUtil.getAssetUrls(this.game.cache, Asset.IMAGES);
        images.forEach((image) => {
            if (image.path.includes("walls/")) {
                wallAssets.push(image.name);
            }
        });

        this.wallBrush = new PaintBrush(this.game, this.myInput, wallAssets);
        this.obstacleBrush = new PaintBrush(this.game, this.myInput, [
            "table"
        ]);
    }

    create(){
        this.floorBrush.create();
        this.wallBrush.create();
        this.obstacleBrush.create()

        // Save - 1
        this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(this.save, this);

        // Download - 2
        this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(this.download, this);
    }

    update(){
        this.myInput.update();

        if (this.floorBrush.isActive()) this.floorBrush.update();
        else if (this.wallBrush.isActive()) this.wallBrush.update();
        else if (this.obstacleBrush.isActive()) this.obstacleBrush.update();
        else if (this.drawRectangle) this.drawRectangle.update();
        else if (this.drawLines) this.drawLines.update();
        else if (this.myInput.isJustDown(InputType.ACTION)) {
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
                case EditorState.NORTH:
                    this.wallBrush.enter(sprites => {
                        this.north = sprites;
                    }, this.north);
                    break;
                case EditorState.EAST:
                    this.wallBrush.enter(sprites => {
                        this.east = sprites;
                    }, this.east, Phaser.Math.degToRad(90));
                    break;
                case EditorState.SOUTH:
                    this.wallBrush.enter(sprites => {
                        this.south = sprites;
                    }, this.south, Phaser.Math.degToRad(180));
                    break;
                case EditorState.WEST:
                    this.wallBrush.enter(sprites => {
                        this.west = sprites;
                    }, this.west, Phaser.Math.degToRad(270));
                    break;
            }
        }
        else if (this.myInput.isJustDown(InputType.ARROW_LEFT) && this.editorStateIndex - 1 >= 0) this.editorStateIndex -= 1;
        else if (this.myInput.isJustDown(InputType.ARROW_RIGHT) && this.editorStateIndex + 1 < EditorState.states.length) this.editorStateIndex += 1;

        if (this.myInput.isDown(InputType.WASD_LEFT)) this.game.camera.x -= this.cameraSpeed;
        else if (this.myInput.isDown(InputType.WASD_RIGHT)) this.game.camera.x += this.cameraSpeed;
        if (this.myInput.isDown(InputType.WASD_UP)) this.game.camera.y -= this.cameraSpeed;
        else if (this.myInput.isDown(InputType.WASD_DOWN)) this.game.camera.y += this.cameraSpeed;

        if (this.myInput.isJustDown(InputType.ESCAPE)) {
            if (this.editorStateActivated) {
                this.editorStateActivated = false;
            } else {
                this.save();
                this.game.camera.setPosition(0, 0);
                this.game.state.start("menu");
            }
        }

        if (this.myInput.isJustDown(InputType.ACTION)) this.drawInOrder();

        this.game.debug.text(EditorState.states[this.editorStateIndex] + (this.editorStateActivated ? " -active-" : ""), 0, 10, "white");
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
        this.north.concat().reverse().concat(this.south.concat().reverse()).concat(this.west.concat().reverse()).concat(this.floor.concat().reverse()).forEach(f);

    }

    download() {
        this.save().then(function onSucess(url:string) {
            window.open(url, "_blank");
        });
    }

    save():Promise<string> {
        var serializeSprites = s=>{return {img: s.key, x: s.x, y: s.y, w: s.width, h: s.height, r: 0}};

        var data = {
            name: "level-0",
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
        return $.ajax({
            method: "POST",
            url: "/level/" + data.name,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}