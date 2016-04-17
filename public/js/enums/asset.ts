class Asset {
    static IMAGES = "images";

    static getUrl(assetKey:Asset):string {
        switch (assetKey) {
            case Asset.IMAGES:
                return "img";
            default:
                return "";
        }
    }
}