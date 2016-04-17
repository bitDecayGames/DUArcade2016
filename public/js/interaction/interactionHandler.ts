class MasterCommand {
    static FALLBACK_MSG = "I seem to be wasting my time."

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
       return this.processVisualAction("look", item);
   }

   inspect(item: IndividualHouseItem):string {
       return this.processVisualAction("inspect", item);
   }

   take(item: IndividualHouseItem):string {
       return this.processEffectAction("take", item);
   }

   open(item: IndividualHouseItem):string {
       return this.processEffectAction("open", item);
   }

   close(item: IndividualHouseItem):string {
       return this.processEffectAction("close", item);
   }

   interact(item: IndividualHouseItem):string {
       return this.processEffectAction("interact", item);
   }



   //utility methods
   processVisualAction(action: string, item: IndividualHouseItem):string {
       console.log("Trying to " + action + " " + item.itemName);
       var index = item[action + "Count"];
       item[action + "Count"]++
       this.saveToLocalStorage(item);

       var itemData = this.items["items"][item.itemName]
       console.log(itemData);
       if (action in itemData) {
           var options = itemData[action]
           console.log(index)
           console.log(options)
           if (index < options.length) {
               return options[index]
           } else {
               return options[options.length - 1]
           }
       }
       return MasterCommand.FALLBACK_MSG;
   }

   processEffectAction(action: string, item: IndividualHouseItem):string {
        console.log("Trying to " + action + " " + item.itemName);
        var itemData = this.items["items"][item.itemName];
        console.log(itemData);

        if (action in itemData) {
            var actionData = itemData[action]
            this.reward(actionData["reward"]);
            this.price(actionData["price"]);
            this.deactivateItems(actionData["deactivateItems"]);
            this.activateItems(actionData["activateItems"]);
            return actionData["text"];
        }
        return MasterCommand.FALLBACK_MSG;
   }

   reward(rewards: string[]) {
        // TODO implement
   }

   price(prices: string[]) {
        // TODO implement
   }

   deactivateItems(itemsByName: string[]) {
        // TODO implement
   }

   activateItems(itemsByName: string[]) {
        // TODO implement
   }

   saveToLocalStorage(item: IndividualHouseItem) {
        localStorage.setItem(item.itemName, JSON.stringify(item));
   }
}