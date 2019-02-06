import { CardRarity } from "./CardRarity";
import { MTGLocale } from "./MTGLocale";
import { MTGFormat } from "./MTGFormat";
import { MTGSpecialLayout } from "./MTGSpecialLayout";

//Details that stay the same between all printings of a card
export default interface MTGCard{
    UUID: string;

    Text?: string;

    //True if this does not represent a full card that can be put into a deck.
    //For example the card "Fire // Ice" will not be secondary, but the cards
    //"Fire" and "Ice" will be secondary. 
    IsSecondary?: boolean;

    //If this is a secondary card, then here the primary card. If this is
    //primary, then here is the list of secondary cards.
    RelatedCardUUIDs?: string[]

    SpecialLayout?: MTGSpecialLayout;

    SuperTypes?: string[];
    Types?: string[];
    SubTypes?: string[];

    Power?: number;
    Toughness?: number;

    ConvertedManaCost?: number;
    Cost?: MTGCost;
    BannedFormats?: MTGFormat[];
}

export interface MTGCost{
    //costType is a value from MTGCostType
    [costType: string]: number;
}

export interface MTGCardPrinting{
    CardUUID: string;

    FlavorText: string;

    UUID: string;
    Locale: MTGLocale;

    SetCode: string;
    Rarity: CardRarity;

    //Some collectors numbers have characters, this is not numeric even though it's called "Number"
    CollectorsNumber: string;

    Artist: string;
}