class AssetsUtil {
    static loadJson(loader:Phaser.Loader, assetKey:string):void {
        loader.json(assetKey, "assets/" + Asset.getUrl(assetKey));
    }

    static getAssetUrls(cache:Phaser.Cache, assetKey:string) {
        return cache.getJSON(assetKey).assets;
    }
}