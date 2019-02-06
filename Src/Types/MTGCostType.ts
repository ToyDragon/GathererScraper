export enum MTGCostType{
    //Ability specific
    Tap = "T",

    //Normal WUBRG+C
    White = "W",
    Blue = "U",
    Black = "B",
    Red = "R",
    Green = "G",
    Colorless = "C",

    //Half WUBRG
    HalfWhite = "HalfW",
    HalfBlue = "HalfU",
    HalfBlack = "HalfB",
    HalfRed = "HalfR",
    HalfGreen = "HalfG",

    //Color Combos
    WhiteOrBlue = "WU",
    WhiteOrBlack = "WB",
    BlueOrRed = "UR",
    BlueOrBlack = "UB",
    BlackOrRed = "BR",
    BlackOrGreen = "BG",
    RedOrWhite = "RW",
    RedOrGreen = "RG",
    GreenOrWhite = "GW",
    GreenOrBlue = "GU",

    //Color or 2 Colorless
    WhiteOrTwoColorless = "2W",
    BlueOrTwoColorless = "2U",
    BlackOrTwoColorless = "2B",
    RedOrTwoColorless = "2R",
    GreenOrTwoColorless = "2G",

    //Color or 2 Life
    WhiteOrTwoLife = "WP",
    BlueOrTwoLife = "UP",
    BlackOrTwoLife = "BP",
    RedOrTwoLife = "RP",
    GreenOrTwoLife = "GP",

    //Variable
    X = "X",
    Y = "Y",
    Z = "Z",
}