class IndividualHouseItem {
    public itemName: string;
    public itemState: ItemState;

    constructor(name: string) {
        this.itemName = name;
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
}
