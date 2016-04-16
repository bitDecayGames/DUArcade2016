class DrawLines {
    private game:Phaser.Game;
    private input: Input;
    private callback:(points:Phaser.Point[], graphics:Phaser.Graphics)=>void;
    private points:Phaser.Point[];
    private color: number = 0xFFFF00;
    private inverseColor: number = 0x0000FF;
    private newLine:Phaser.Graphics;
    private line:Phaser.Graphics;

    constructor(game: Phaser.Game, input: Input, callback:(points:Phaser.Point[], graphics:Phaser.Graphics)=>void, color?:number, points?:Phaser.Point[], graphics?:Phaser.Graphics){
        this.game = game;
        this.input = input;
        this.callback = callback;
        if (points) this.points = points;
        else this.points = [];
        if (color) this.color = color;
        this.inverseColor = Phaser.Color.getColor(255 - Phaser.Color.getRed(this.color), 255 - Phaser.Color.getGreen(this.color), 255 - Phaser.Color.getBlue(this.color));

        if (graphics) this.line = graphics;
        else this.line = this.game.add.graphics(0, 0);
        this.newLine = this.game.add.graphics(0, 0);
    }

    private mousePos():Phaser.Point{return new Phaser.Point(this.game.input.x, this.game.input.y)}

    private drawLine(line: Phaser.Graphics, a:Phaser.Point, b:Phaser.Point){
        line.moveTo(a.x, a.y);
        line.lineTo(b.x, b.y);
    }

    private drawLines(){
        this.line.clear();
        this.line.lineStyle(2, this.color, 1);
        this.newLine.clear();
        this.newLine.lineStyle(1, this.inverseColor, 1);

        this.points.forEach((point:Phaser.Point, index:number)=>{
            if (index + 1 >= this.points.length) return;
            this.drawLine(this.line, point, this.points[index + 1]);
        });
        if (this.points.length > 0) {
            this.drawLine(this.line, this.points[this.points.length - 1], this.points[0]);
            this.drawLine(this.newLine, this.points[this.points.length - 1], this.mousePos());
            this.drawLine(this.newLine, this.points[0], this.mousePos());
        }
    }

    private addPoint(){
        this.points.push(this.mousePos());
        console.log("Lines: "+ this.points.length);
    }

    update(){
        this.drawLines();
        if (this.input.isJustDown(InputType.ACTION)) this.addPoint();
        else if (this.input.isJustDown(InputType.DELETE) && this.points.length > 0) this.points.splice(this.points.length - 1, 1);
        else if (this.input.isJustDown(InputType.ESCAPE) && this.callback) {
            this.newLine.clear();
            this.callback(this.points, this.line);
        }
    }
}