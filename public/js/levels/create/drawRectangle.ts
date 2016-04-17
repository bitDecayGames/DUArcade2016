import Rectangle = Phaser.Rectangle;
class DrawRectangle {
    private game:Phaser.Game;
    private input:Input;
    private callback:(rects:MyDrawRectangles)=>void;
    private rects:MyDrawRectangles;

    constructor(game: Phaser.Game, input:Input, callback:(rects:MyDrawRectangles)=>void, rects?:MyDrawRectangles){
        this.game = game;
        this.input = input;
        this.callback = callback;
        if (rects) this.rects = rects;
        else this.rects = new MyDrawRectangles(game);
    }

    private mousePos():Phaser.Point{return new Phaser.Point((this.game.camera.position.x - this.game.width / 2) + this.game.input.x, (this.game.camera.position.y - this.game.height / 2) + this.game.input.y)}

    update(){
        if (this.input.isJustDown(InputType.ACTION)) this.rects.startNewRect(this.mousePos());
        else if (this.input.isJustUp(InputType.ACTION)) this.rects.addRect();
        else if (this.input.isJustDown(InputType.DELETE)) this.rects.removeLastRect();
        else if (this.input.isJustDown(InputType.ARROW_LEFT)) this.rects.moveLastRect(-1, 0);
        else if (this.input.isJustDown(InputType.ARROW_RIGHT)) this.rects.moveLastRect(1, 0);
        else if (this.input.isJustDown(InputType.ARROW_UP)) this.rects.moveLastRect(0, -1);
        else if (this.input.isJustDown(InputType.ARROW_DOWN)) this.rects.moveLastRect(0, 1);
        else if (this.input.isJustDown(InputType.ESCAPE) && this.callback) {
            this.rects.clearCurrentRect();
            this.callback(this.rects);
        }

        this.rects.draw(this.mousePos());
    }
}

class MyDrawRectangles{
    rects:Phaser.Rectangle[];
    currentRect:Phaser.Rectangle;
    graphics:Phaser.Graphics;
    inverseGraphics:Phaser.Graphics;
    color:number;
    inverseColor:number;
    private down:Phaser.Point;
    constructor(game:Phaser.Game, color:number = 0xAA0044){
        this.graphics = game.add.graphics(0, 0);
        this.inverseGraphics = game.add.graphics(0, 0);
        this.setColor(color);
        this.rects = [];
        this.currentRect = null;
    }

    private updateCurrentRect(mousePosition:Phaser.Point){
        this.currentRect.width = Math.abs(this.down.x - mousePosition.x);
        this.currentRect.height = Math.abs(this.down.y - mousePosition.y);

        if (mousePosition.x < this.down.x) this.currentRect.x = mousePosition.x;
        else this.currentRect.x = mousePosition.x - this.currentRect.width;

        if (mousePosition.y < this.down.y) this.currentRect.y = mousePosition.y;
        else this.currentRect.y = mousePosition.y - this.currentRect.height;
    }

    draw(mousePosition?:Phaser.Point){
        this.graphics.clear();
        this.graphics.lineStyle(2, this.color);
        this.rects.forEach((rect)=>{
            this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
        });
        if(this.currentRect && mousePosition) {
            this.updateCurrentRect(mousePosition);
            this.inverseGraphics.clear();
            this.inverseGraphics.lineStyle(2, this.inverseColor);
            this.inverseGraphics.drawRect(this.currentRect.x, this.currentRect.y, this.currentRect.width, this.currentRect.height);
        }
    }

    setColor(color:number){
        this.color = color;
        this.inverseColor = Phaser.Color.getColor(
            255 - Phaser.Color.getRed(this.color),
            255 - Phaser.Color.getGreen(this.color),
            255 - Phaser.Color.getBlue(this.color)
        );
    }

    startNewRect(down:Phaser.Point){
        if (!this.currentRect) {
            this.down = down;
            this.currentRect = new Rectangle(0, 0, 0, 0);
        }
    }

    addRect(){
        if (this.currentRect){
            this.rects.push(this.currentRect);
            this.clearCurrentRect();
        }
    }

    removeLastRect(){
        if (this.rects.length > 0) this.rects.splice(this.rects.length - 1, 1);
    }

    clearCurrentRect(){
        this.currentRect = null;
        this.down = null;
        this.inverseGraphics.clear();
    }

    moveLastRect(x:number, y:number){
        if (this.rects.length > 0){
            var r = this.rects[this.rects.length - 1];
            r.x += x;
            r.y += y;
        }
    }

    rotate(degrees:number, rotationPoint:Phaser.Point){
        var steps = Math.round(degrees / 90);
        if (steps === 0 || steps % 4 === 0) return; // noop
        var shouldStretchRect = steps % 2 !== 0;
        var shouldReflectRect = steps / 2 === 0;
        this.rects.forEach((rect:Phaser.Rectangle) => {
            var p = new Phaser.Point(rect.x, rect.y);
            p.rotate(rotationPoint.x, rotationPoint.y, degrees, true);
            rect.x = p.x;
            rect.y = p.y;
            if (shouldStretchRect){
                var w = rect.width;
                var h = rect.height;
                rect.width = h;
                rect.height = w;
            }
            if (shouldReflectRect){
                rect.x -= rect.width;
                rect.y -= rect.height;
            } else if (steps < 0) rect.y -= rect.height;
            else rect.x -= rect.width;
        });
        this.draw();
    }
}