class Init extends Phaser.State {
    preload(){
        this.load.json('gameInfo', 'conf/game.json');
        AssetsUtil.loadJson(this.load, Asset.IMAGES);
        AssetsUtil.loadJson(this.load, Asset.LEVELS);
    }

    create(){
        this.game.state.start("menu");
    }
}