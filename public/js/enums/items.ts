class IndividualHouseItem {
    public itemName: string;
    public itemState: ItemState;

    public lookCount: number;
    public inspectCount: number;

    constructor(name: string) {
        this.itemName = name;
        this.lookCount = 0;
        this.inspectCount = 0;
    }
}

class HouseItems {
    static DUST = new IndividualHouseItem("Dust");
    static DUST_PILE = new IndividualHouseItem("Dust Pile");
    static ENVELOPE = new IndividualHouseItem("Envelope");
    static DUST_FILLED_ENVELOPE = new IndividualHouseItem("Dust Filled Envelope");
    static FEATHER_DUSTER = new IndividualHouseItem("Feather Duster");
    static TUMBLER_GLASS = new IndividualHouseItem("Tumbler Glass");
    static DUSTY_GLASS = new IndividualHouseItem("Dusty Glass");
    static TAPE = new IndividualHouseItem("Tape");

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
