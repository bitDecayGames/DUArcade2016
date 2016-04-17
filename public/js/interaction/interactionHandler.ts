class MasterCommand {
    private game: Phaser.Game;
    private items;

   constructor(game: Phaser.Game) {
        this.game = game;
        this.items = game.cache.getJSON('items');
   }

   initialLoad() {
        console.log("initialLoad()");
        // loop through all objects and load
        HouseItems.ITEM_LIST.forEach(item => {
            console.log("Trying to load " + item.itemName)
            var itemJSON:any = JSON.parse(localStorage.getItem(item.itemName));
            if (itemJSON) {
                console.log("Data found for " + item.itemName);
                console.log(itemJSON);
                item.itemState = itemJSON["itemState"]
                item.lookCount = itemJSON["lookCount"]
                item.inspectCount = itemJSON["inspectCount"]
            }
        });
   }

   look(item: IndividualHouseItem):string {
    console.log("Looking at " + item.itemName);
    var index = item.lookCount;
    item.lookCount++
    localStorage.setItem(item.itemName, JSON.stringify(item))

    var itemData = this.items["items"][item.itemName]
    console.log(itemData);
    if ("look" in itemData) {
        var options = itemData["look"]
        console.log(index)
        console.log(options)
        if (index < options.length) {
            return options[index]
        } else {
            return options[options.length - 1]
        }
    }
    return "k";
   }
}