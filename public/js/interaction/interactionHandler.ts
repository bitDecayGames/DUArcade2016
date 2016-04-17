class MasterCommand {
    private game: Phaser.Game;
    private items;

   constructor(game: Phaser.Game) {
        this.game = game;
        this.items = game.cache.getJSON('items');
   }

   initialLoad() {
   // loop through all objects and load

   }

   look(item: IndividualHouseItem):string {
    console.log(this.items["items"][item.itemName]);
    return "k";
   }
}