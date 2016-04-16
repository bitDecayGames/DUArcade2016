class DrawLines {
    private game:Phaser.Game;
    private input: Input;
    private callback:(line:MyDrawLines)=>void;
    private lines:MyDrawLines;

    constructor(game: Phaser.Game, input: Input, callback:(line:MyDrawLines)=>void, lines?:MyDrawLines){
        this.game = game;
        this.input = input;
        this.callback = callback;
        if (lines) this.lines = lines;
        else this.lines = new MyDrawLines(game);
    }

    private mousePos():Phaser.Point{return new Phaser.Point(this.game.input.x, this.game.input.y)}

    update(){
        this.lines.draw(this.mousePos());
        if (this.input.isJustDown(InputType.ACTION)) this.lines.addLine(this.mousePos());
        else if (this.input.isJustDown(InputType.DELETE)) this.lines.removeLastLine();
        else if (this.input.isJustDown(InputType.LEFT)) this.lines.moveLastPoint(-1, 0);
        else if (this.input.isJustDown(InputType.RIGHT)) this.lines.moveLastPoint(1, 0);
        else if (this.input.isJustDown(InputType.UP)) this.lines.moveLastPoint(0, -1);
        else if (this.input.isJustDown(InputType.DOWN)) this.lines.moveLastPoint(0, 1);
        else if (this.input.isJustDown(InputType.ESCAPE) && this.callback) {
            this.lines.clearGuideLines();
            this.callback(this.lines);
        }
    }
}

class MyDrawLines{
    points:Phaser.Point[];
    graphics:Phaser.Graphics;
    inverseGraphics:Phaser.Graphics;
    color:number;
    inverseColor:number;
    constructor(game:Phaser.Game, color:number = 0xFFFF00){
        this.points = [];
        this.graphics = game.add.graphics(0, 0);
        this.inverseGraphics = game.add.graphics(0, 0);
        this.setColor(color);
    }

    private drawLine(line: Phaser.Graphics, a:Phaser.Point, b:Phaser.Point){
        line.moveTo(a.x, a.y);
        line.lineTo(b.x, b.y);
    }

    draw(mousePosition?:Phaser.Point){
        this.graphics.clear();
        this.graphics.lineStyle(4, this.color);

        this.points.forEach((point:Phaser.Point, index:number)=>{
            if (index + 1 >= this.points.length) return;
            this.drawLine(this.graphics, point, this.points[index + 1]);
        });

        if (this.points.length > 0) {
            this.drawLine(this.graphics, this.points[this.points.length - 1], this.points[0]);

            if (mousePosition) {
                this.inverseGraphics.clear();
                this.inverseGraphics.lineStyle(2, this.inverseColor);
                this.drawLine(this.inverseGraphics, this.points[this.points.length - 1], mousePosition);
                this.drawLine(this.inverseGraphics, this.points[0], mousePosition);
            }
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

    addLine(mousePosition:Phaser.Point){
        this.points.push(mousePosition);
    }

    removeLastLine(){
        if (this.points.length > 0) this.points.splice(this.points.length - 1, 1);
    }

    clearGuideLines(){
        this.inverseGraphics.clear();
    }

    moveLastPoint(x:number, y:number){
        if (this.points.length > 0){
            var p = this.points[this.points.length - 1];
            p.x += x;
            p.y += y;
        }
    }
}