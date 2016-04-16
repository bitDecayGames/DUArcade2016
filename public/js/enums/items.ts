class HouseItems {
    static _TUMBLER_GLASS = "Tumbler_Glass";
    static get TUMBLER_GLASS():Boolean { return "true" === localStorage.getItem(HouseItems._TUMBLER_GLASS) }
    static set TUMBLER_GLASS(newValue: Boolean) { localStorage.setItem(HouseItems._TUMBLER_GLASS, "" + newValue) }

    static FEATHER_DUSTER = new IndividualHouseItem("Feather Duster")
}

class IndividualHouseItem {
    name = ""
    has = false
    interactCount = 0

    constructor(name: string)

    get()

    set()

    get()

    set()
}


if ()