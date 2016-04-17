class DUArcade2016Game extends Phaser.State {
    level: Level;

    preload() {
        this.load.audio('step', ['../sfx/step_tile.wav']);
        this.load.json('test-level-0', '../../data/levels/test-level-0.json');
        this.load.json('items', '../../data/interaction/interaction.json');
    }

    create() {
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setBoundsToWorld(false, false, false, false);
        this.level = new Level(this.game, new LevelData(this.cache.getJSON("test-level-0")));
        var commander = (new MasterCommand(this.game));
        commander.initialLoad();
        console.log(commander.look(HouseItems.DUST));
        console.log(commander.inspect(HouseItems.DUST));
    }

    update() {
        this.level.update();
    }
}
