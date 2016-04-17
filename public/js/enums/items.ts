class IndividualHouseItem {
    public itemName: string;
    public itemState: ItemState;
    public imageKey: string;

    public lookCount: number;
    public inspectCount: number;

    constructor(name: string, key: string) {
        this.itemName = name;
        this.imageKey = key;
        this.lookCount = 0;
        this.inspectCount = 0;
    }
}

class HouseItems {
    static DUST = new IndividualHouseItem("Dust", "table");
    static DUST_PILE = new IndividualHouseItem("Dust Pile", "lever_down");
    static ENVELOPE = new IndividualHouseItem("Envelope", "fireplace");
    static DUST_FILLED_ENVELOPE = new IndividualHouseItem("Dust Filled Envelope", "rug_center");
    static FEATHER_DUSTER = new IndividualHouseItem("Feather Duster", "dust");
    static TUMBLER_GLASS = new IndividualHouseItem("Tumbler Glass", "dust");
    static DUSTY_GLASS = new IndividualHouseItem("Dusty Glass", "dust");
    static TAPE = new IndividualHouseItem("Tape", "dust");

    static ITEM_LIST:IndividualHouseItem[] = [
        HouseItems.DUST,
        HouseItems.DUST_PILE,
        HouseItems.ENVELOPE,
        HouseItems.DUST_FILLED_ENVELOPE,
        HouseItems.FEATHER_DUSTER,
        HouseItems.TUMBLER_GLASS,
        HouseItems.DUSTY_GLASS,
        HouseItems.TAPE
    ];
}
