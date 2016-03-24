class TestRotationLevel {
    private floorplan = [[100, 100], [100, 300], [500, 300], [500, 100]];
    private debugLines = [];

    constructor(){
        var lastPoint = this.floorplan[this.floorplan.length - 1];
        this.floorplan.forEach((point) => {
            this.debugLines.push(new Phaser.Line(lastPoint[0], lastPoint[1], point[0], point[1]));
            lastPoint = point;
        });
    }

    draw(game: Phaser.Game){
        this.debugLines.forEach((line) => {
            game.debug.geom(line);
        });
    }
}