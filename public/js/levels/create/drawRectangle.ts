class DrawRectangle {
    private game:Phaser.Game;
    private input:Input;
    private callback:(rects:Phaser.Rectangle[], graphics:Phaser.Graphics)=>void;
    private rects:Phaser.Rectangle[];
    private currentRect:Phaser.Rectangle;
    private color: number = 0xAA0044;
    private inverseColor: number;
    private down:Phaser.Point;
    private graphics:Phaser.Graphics;

    constructor(game: Phaser.Game, input:Input, callback:(rects:Phaser.Rectangle[], graphics:Phaser.Graphics)=>void, color?:number){
        this.game = game;
        this.input = input;
        this.callback = callback;
        this.rects = [];
        if (color) this.color = color;
        this.inverseColor = Phaser.Color.getColor(255 - Phaser.Color.getRed(this.color),255 - Phaser.Color.getGreen(this.color),255 - Phaser.Color.getBlue(this.color));
        this.graphics = this.game.add.graphics(0, 0);
    }

    private mousePos():Phaser.Point{return new Phaser.Point(this.game.input.x, this.game.input.y)}

    private rectangleSize(rect:Phaser.Rectangle, down:Phaser.Point, cur:Phaser.Point){
        rect.width = Math.abs(down.x - cur.x);
        rect.height = Math.abs(down.y - cur.y);

        if (cur.x < down.x) rect.x = cur.x;
        else rect.x = cur.x - rect.width;

        if (cur.y < down.y) rect.y = cur.y;
        else rect.y = cur.y - rect.height;
    }

    private drawRectangles(){
        this.graphics.clear();
        this.graphics.lineStyle(2, this.color);
        this.rects.forEach((rect)=>{
            this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        });
        if(this.currentRect) {
            this.graphics.lineStyle(2, this.inverseColor);
            this.graphics.drawRect(this.currentRect.x, this.currentRect.y, this.currentRect.width, this.currentRect.height);
        }
    }

    update(){
        if (this.currentRect) this.rectangleSize(this.currentRect, this.down, this.mousePos());

        if (this.input.isJustDown(InputType.ACTION)) {
            this.currentRect = new Phaser.Rectangle(0, 0, 0, 0);
            this.down = this.mousePos();
        } else if (this.input.isJustUp(InputType.ACTION) && this.currentRect) {
            this.rects.push(this.currentRect);
            this.currentRect = null;
        } else if (this.input.isJustDown(InputType.DELETE) && this.rects.length > 0) this.rects.splice(this.rects.length - 1, 1);
        else if (this.input.isJustDown(InputType.ESCAPE) && this.callback) {
            this.currentRect = null;
            this.drawRectangles();
            this.callback(this.rects, this.graphics);
        }

        this.drawRectangles();
    }
}