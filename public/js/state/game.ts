class DUArcade2016Game extends Phaser.State {
    level: Level;

    preload() {
        this.load.image('apple', '../img/apple.png');
        this.load.image('floor', '../img/floor.png');
        this.load.image('wall', '../img/wall.png');
        this.load.json('test-level-0', '../../data/levels/test-level-0.json');
    }

    create() {
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setBoundsToWorld(false, false, false, false);
        this.level = new Level(this.game, new LevelData(this.cache.getJSON("test-level-0")));
    }

    update() {
        this.level.update();
    }
}