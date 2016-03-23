import Group = Phaser.Group;
class Credits extends Phaser.State {
    private gameInfo: {credits: {}};
    private text: Phaser.Group;
    private roleFont = { font: "30px Arial", fill: "#ffffff" };
    private nameFont = { font: "20px Arial", fill: "#ffffff" };
    private startingY = 100;
    private startingX = 10;
    private verticalNameSpacing = 50;
    private verticalTitleSpacing = 20;
    private horizontalNameOffset = 30;
    private totalTextHeight: number;
    private scrollSpeed = 1;
    private myInput: Input;

    create(){
        this.myInput = new Input(this.game);

        this.gameInfo = this.cache.getJSON("gameInfo");
        this.text = this.game.add.group();

        var y = this.world.height + this.startingY;
        for (var role in this.gameInfo.credits){
            if (this.gameInfo.credits.hasOwnProperty(role)) {
                this.game.add.text(this.startingX, y, role, this.roleFont, this.text);
                y += this.verticalNameSpacing;
                this.gameInfo.credits[role].forEach((person: string) => {
                    this.game.add.text(this.startingX + this.horizontalNameOffset, y, person, this.nameFont, this.text);
                    y += this.verticalNameSpacing;
                });
                y += this.verticalTitleSpacing;
            }
        }
        this.totalTextHeight = y;
    }
    update(){
        this.myInput.update();
        this.text.y -= this.scrollSpeed;
        if (this.totalTextHeight + this.text.y < 0) this.back();
        if (this.myInput.isJustDown(InputType.ACTION)) this.back();
    }

    back(){
        this.game.state.start("menu");
    }
}