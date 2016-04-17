class Asset {
    static IMAGES = "images";
    static LEVELS = "levels";

    static getUrl(assetKey:string):string {
        switch (assetKey) {
            case this.IMAGES:
                return "img";
            case this.LEVELS:
                return "data:levels";
            default:
                return "";
        }
    }
}