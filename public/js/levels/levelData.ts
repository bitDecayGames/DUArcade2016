class LevelData {
    public name: string;
    public camera: CameraData;
    public load: Load;
    public floorplan: Floorplan;
    public north: Direction;
    public east: Direction;
    public south: Direction;
    public west: Direction;
    public directions: Direction[];
    public facing: number = 0;

    constructor(data){
        this.name = data.name;
        this.camera = new CameraData(data.camera);
        this.load = new Load(data.load);
        this.floorplan = new Floorplan(data.floorplan);
        this.north = new Direction(data.north, 0);
        this.east = new Direction(data.east, 90);
        this.south = new Direction(data.south, 180);
        this.west = new Direction(data.west, 270);
        this.directions = [ this.north, this.east, this.south, this.west ];
    }

    rotate(clockwise: boolean){
        if (clockwise) this.facing -= 1;
        else this.facing += 1;
        if (this.facing < 0) this.facing = 3;
        else if (this.facing > 3) this.facing = 0;
    }

    rotateLeft(){
        this.rotate(false);
    }

    rotateRight(){
        this.rotate(true);
    }

    getCurrentDirection():Direction {
        return this.directions[this.facing];
    }

    getOtherDirections():Direction[] {
        var other = [];
        this.directions.forEach((dir, index)=>{
            if (index != this.facing) other.push(dir);
        });
        return other;
    }

    getScenery(): LevelImage[] {
        var all = [];
        this.directions.forEach((dir)=>{
            dir.scenery.forEach((s)=>{
                all.push(s);
            });
        });
        return all;
    }

    toJson(){return {
        name: this.name,
        camera: this.camera.toJson(),
        floorplan: this.floorplan.toJson(),
        north: this.north.toJson(),
        east: this.east.toJson(),
        south: this.south.toJson(),
        west: this.west.toJson()
    }}
}

class CameraData {
    follow: boolean;
    viewport: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    constructor(data){
        this.follow = data.follow;
        this.viewport = {
            x: data.viewport.x,
            y: data.viewport.y,
            w: data.viewport.w,
            h: data.viewport.h
        };
    }

    toJson(){return {
        follow: this.follow,
        viewport: this.viewport
    }}
}

class Load {
    imgs: string[];
    constructor(data){
        this.imgs = data.imgs;
    }

    toJson(){return {imgs: this.imgs}}
}

class Floorplan {
    outline: Phaser.Point[];
    obstacles: Phaser.Rectangle[];
    floor: LevelImage[];
    constructor(data){
        this.outline = data.outline.map(p=>{return new Phaser.Point(p.x, p.y)});
        this.obstacles = data.obstacles.map(r=>{return new Phaser.Rectangle(r.x, r.y, r.w, r.h)});
        this.floor = data.floor.map(i => { return new LevelImage(i) });
    }

    toJson(){return {
        outline: this.outline.map(p=>{return {x: p.x, y: p.y}}),
        obstacles: this.obstacles.map(r=>{return {x: r.x, y: r.y, w: r.width, h: r.height}}),
        floor: this.floor.map(i=>{return i.toJson()}),
    }}
}

class Direction {
    scenery: LevelImage[];
    constructor(data, rotationDeg){
        this.scenery = data.scenery.map(i => { return new LevelImage(i, rotationDeg) });
    }

    toJson(){return {
        scenery: this.scenery.map(i=>{return i.toJson()})
    }}
}

class LevelImage {
    sprite: Phaser.Sprite;
    img: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    constructor(data, rotationDeg?:number){
        this.img = data.img;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
        this.rotation = data.r + (rotationDeg ? rotationDeg : 0);
    }

    toJson(){return {
        img: this.img,
        x: this.x,
        y: this.y,
        w: this.width,
        h: this.height,
        r: this.rotation
    }}
}
