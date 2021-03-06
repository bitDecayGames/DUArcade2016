class Menu extends Phaser.State {
    gameInfo: {title: string};
    titleFont = { font: "50px Arial", fill: "#ffffff" };
    buttonFont = { font: "50px Arial", fill: "#ffffff" };
    buttonGrp: Phaser.Group;
    buttons: MenuButton[];
    menuInfo: {buttons: [{text: string, state: string}]};
    verticalMenuSpacing = 50;
    menuStartY: number;
    menuEndY: number;
    menuPadding = 20;
    menuMoveSpeed = 10;
    selectedIndex: number;
    selectedSymbol = ">";
    myInput: Input;

    preload(){
        this.load.json('menuInfo', 'conf/menu.json');
        this.load.audio('slap', ['../sfx/slap.wav']);
        this.load.audio('raspberry', ['../sfx/raspberry.wav']);

        var images = AssetsUtil.getAssetUrls(this.game.cache, Asset.IMAGES);
        images.forEach((image) => {
            this.load.image(image.name, image.path);
        });
    }
    create(){
        this.game.world.setBounds(0, 0, 800, 600);

        this.selectedIndex = -1;
        this.menuStartY = this.game.height + this.menuPadding;
        this.buttons = [];
        this.gameInfo = this.cache.getJSON("gameInfo");
        this.menuInfo = this.cache.getJSON("menuInfo");
        this.myInput = new Input(this.game);

        this.buttonGrp = this.add.group();

        this.add.text(this.world.width / 2, 0, this.gameInfo.title, this.titleFont).anchor.set(0.5, 0);

        var y = 0;
        this.menuInfo.buttons.forEach((buttonInfo) => {
            this.buttons.push({
                obj: this.add.text(0, y, buttonInfo.text, this.buttonFont, this.buttonGrp),
                info: buttonInfo
            });
            y += this.verticalMenuSpacing;
        });
        this.menuEndY = this.world.height - (this.menuPadding + y);
        this.buttonGrp.y = this.menuStartY;
    }

    update(){
        this.myInput.update();

        if (this.myInput.isJustDown(InputType.LEFT) || this.myInput.isJustDown(InputType.UP)){
            SoundUtil.playSound(this.game, 'slap');
            if (this.selectedIndex <= 0) this.selectedIndex = this.buttons.length - 1;
            else this.selectedIndex -= 1;
            this.markSelected();
        } else if (this.myInput.isJustDown(InputType.RIGHT) || this.myInput.isJustDown(InputType.DOWN)){
            SoundUtil.playSound(this.game, 'slap');
            if (this.selectedIndex >= this.buttons.length - 1 || this.selectedIndex < 0) this.selectedIndex = 0;
            else this.selectedIndex += 1;
            this.markSelected();
        }

        if (this.myInput.isJustDown(InputType.ACTION)) this.select();

        if (this.buttonGrp.y > this.menuEndY) this.buttonGrp.y -= this.menuMoveSpeed;
    }

    markSelected(){
        this.buttons.forEach((button, index) => {
            if (index == this.selectedIndex) button.obj.text = this.selectedSymbol + button.info.text;
            else button.obj.text = button.info.text;
        });
    }

    select(){
        this.buttons.forEach((button, index) => {
            if (index == this.selectedIndex) {
                SoundUtil.playSound(this.game, 'raspberry');
                this.game.state.start(button.info.state);
            }
        });
    }
}

interface MenuButton {
    obj: Phaser.Text;
    info: {text: string, state: string}
}
