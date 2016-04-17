class Init extends Phaser.State {
    preload(){
        this.load.json('gameInfo', 'conf/game.json');
        this.load.spritesheet('playerSheet', 'img/player.png', 18, 45, 16);
        AssetsUtil.loadJson(this.load, Asset.IMAGES);
        AssetsUtil.loadJson(this.load, Asset.LEVELS);
    }

    create(){
        this.game.state.start("menu");
    }
}