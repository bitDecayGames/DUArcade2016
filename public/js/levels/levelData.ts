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
        this.north = new Direction(data.north);
        this.east = new Direction(data.east);
        this.south = new Direction(data.south);
        this.west = new Direction(data.west);
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

    getScenery(): Scenery[] {
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
    imgs: ImgData[];

    constructor(data){
        this.imgs = data.imgs.map((i)=>{return new ImgData(i)});
    }

    toJson(){return {imgs: this.imgs.map((i)=>{return i.toJson()})}}
}

class ImgData {
    name: string;
    path: string;

    constructor(data){
        this.name = data.name;
        this.path = data.path;
    }

    toJson(){return {name: this.name, path: this.path}}
}

class Floorplan {
    outline: Phaser.Point[];
    obstacles: Array<Array<Phaser.Point>>;
    scenery: Scenery[];
    interactables: Interactable[];
    constructor(data){
        this.outline = data.outline.map((p)=>{return new Phaser.Point(p.x, p.y)});
        this.obstacles = data.obstacles.map((poly)=>{return poly.map((p)=>{return new Phaser.Point(p.x, p.y)})});
        this.scenery = data.scenery.map((s) => { return new Scenery(s) });
        this.interactables = data.interactables.map((i) => { return new Interactable(i) });
    }

    toJson(){return {
        outline: this.outline.map((p)=>{return {x: p.x, y: p.y}}),
        obstacles: this.obstacles.map((poly)=>{return poly.map((p)=>{return {x: p.x, y: p.y}})}),
        scenery: this.scenery.map((s)=>{return s.toJson()}),
        interactables: this.interactables.map((i)=>{return i.toJson()}),
    }}
}

class Direction {
    scenery: Scenery[];
    interactables: Interactable[];
    constructor(data){
        this.scenery = data.scenery.map((s) => { return new Scenery(s) });
        this.interactables = data.interactables.map((i) => { return new Interactable(i) });
    }

    toJson(){return {
        scenery: this.scenery.map((s)=>{return s.toJson()}),
        interactables: this.interactables.map((i)=>{return i.toJson()})
    }}
}

class Scenery {
    sprite: Phaser.Sprite;
    img: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    constructor(data){
        this.img = data.img;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
        this.rotation = data.r;
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

class Interactable {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(data){
        this.name = data.name;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
    }

    toJson(){return {
        name: this.name,
        x: this.x,
        y: this.y,
        w: this.width,
        h: this.height
    }}
}