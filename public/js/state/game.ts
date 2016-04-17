class DUArcade2016Game extends Phaser.State {
    level: Level;

    preload() {
        this.load.image('apple', '../img/apple.png');
        this.load.image('floor', '../img/floor.png');
        this.load.image('wall', '../img/wall.png');
        this.load.json('test-level-0', '../../data/levels/test-level-0.json');
        this.load.json('items', '../../data/interaction/interaction.json');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setBoundsToWorld(false, false, false, false);
        this.level = new Level(this.game, new LevelData(this.cache.getJSON("test-level-0")));
        (new MasterCommand(this.game)).look(HouseItems.DUST)
    }

    update() {
        this.level.update();
    }
}