class FollowingText {
    game: Phaser.Game;
    player: Player;
    lifeSpan: number; // number of seconds to follow the player for
    text: Phaser.Text;

    constructor(game: Phaser.Game, player: Player, life:number, words: string) {
        console.log("creating text")
        this.game = game;
        this.player = player;
        this.lifeSpan = life;

        var style = { font: "bold 24px Arial", fill: "#511", wordWrap: true, wordWrapWidth: this.player.sprite.width * 20, align: "center"};
        this.text = game.add.text(0, 0, words, style);
        this.text.anchor.set(0.5);
        this.text.stroke = '#000000';
        this.text.strokeThickness = 6;
        this.text.fill = '#AA4444';
        this.game.time.events.add(Phaser.Timer.SECOND * life, this.kill, this);
    }

    update() {
        this.text.x = Math.floor(this.player.sprite.x + this.player.sprite.width / 2);
        this.text.y = Math.floor(this.player.sprite.y + this.player.sprite.height * 2);
    }

    kill() {
        console.log("Killing Text")
        this.game.world.remove(this.text);
        this.player.clearFollowingText();
    }
}