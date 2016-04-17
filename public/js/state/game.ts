class DUArcade2016Game extends Phaser.State {
    levelName:string;
    level: Level;

    preload() {
        this.load.audio('step', ['../sfx/step_tile.wav']);
        this.load.json('items', '../../data/interaction/interaction.json');

        var levels = AssetsUtil.getAssetUrls(this.game.cache, Asset.LEVELS);
        levels.forEach((level) => {
            this.load.json(level.name, level.path);
        })
    }

    init(levelName:string) {
        this.levelName = levelName;
        if (!this.levelName) {
            this.levelName = "test-level-0";
        }
    }

    create() {
        this.game.world.setBounds(-1024, -1024, 2048, 2048);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setBoundsToWorld(false, false, false, false);

        this.level = new Level(this.game, new LevelData(this.cache.getJSON(this.levelName)));

        var commander = (new MasterCommand(this.game));
        commander.initialLoad();

        var keyR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        keyR.onDown.add(this.reloadLevel, this);
    }

    update() {
        this.level.update();
    }

    reloadLevel() {
        this.game.state.start("game", true, false, this.levelName);
    }
}
