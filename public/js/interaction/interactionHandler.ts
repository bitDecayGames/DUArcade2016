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
            console.log("Doing " + action + " on " + item.itemName);
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
        console.log("Processing rewards");
        this.changeItemStates(rewards, ItemState.INVENTORY);
   }

   price(prices: string[]) {
        console.log("Processing prices");
        this.changeItemStates(prices, ItemState.INACTIVE);
   }

   deactivateItems(itemsByName: string[]) {
        console.log("Processing deactivations");
        this.changeItemStates(itemsByName, ItemState.INACTIVE);
   }

   activateItems(itemsByName: string[]) {
        console.log("Processing activations");
        this.changeItemStates(itemsByName, ItemState.MAP_ACTIVE);
   }

   saveToLocalStorage(item: IndividualHouseItem) {
        localStorage.setItem(item.itemName, JSON.stringify(item));
   }

   changeItemStates(itemsByName: string[], state: ItemState) {
        itemsByName.forEach(itemName => {
            console.log("Processing item: " + itemName);
            var itemFromList = this.findItem(itemName);
            console.log("Item from list: " + itemFromList.itemName);
            itemFromList.itemState = state;
            this.saveToLocalStorage(itemFromList);
        });
   }

   findItem(itemName: string): IndividualHouseItem {
        console.log("Looking for: " + itemName);
        return HouseItems.ITEM_LIST.find(item => {
            console.log("Comparing with " + item.itemName);
            return item.itemName === itemName;
        });
   }
}