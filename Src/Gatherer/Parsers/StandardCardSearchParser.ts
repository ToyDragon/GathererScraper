import ParserBase from "./ParserBase";
import { MTGCostType } from "../../Types/MTGCostType";
import { MTGCardRarity } from "../../Types/MTGCardRarity";
import { MTGCardSuperType } from "../../Types/MTGCardSuperType";

interface CardSearchCardDetails{
    name: string;
    text: string;
    cost: {[costType: string]: number};
    power?: string;
    toughness?: string;
    loyalty?: string;
    superTypes?: string[];
    types?: string[];
    subTypes?: string[];
    rarity: MTGCardRarity;
    
    multiverseId: string;
}

interface CardSearchSetDetails{
    code: string;
    numberCards: number;
    cards: CardSearchCardDetails[];
    name: string;
}

let setCodeRegex = /&set=([^&]+)&/;
let cardCountRegex = /\(([0-9]+)\)/;
let cardSplitNameRegex = /([^\(]+)(?:\(([^\)]+)\))?/;
let cardCostRegex = /&name=([^&]+)&/;
let cardRarityRegex = /&rarity=(.)/;
let midRegex = /\?multiverseid=([0-9]+)/;
let cardTypesRegex = /([a-zA-Z ]*)(?:— ([a-zA-Z \n]*)(?:\(((?:[0-9x\*+-]*(?:\{1\/2\})?|∞))(?:\/([0-9x\*+-]*(?:\{1\/2\})?))?\))?)?/u;

export default class StandardCardSearchParser extends ParserBase{

    private setName: string;

    public constructor(setName: string, $: CheerioStatic) {
        super($);
        this.setName = setName;
    }

    public Parse(): CardSearchSetDetails{
        let setDeetz: CardSearchSetDetails = {} as any;

        setDeetz.name = this.setName;

        let setUrl = this.$(".rightCol img").attr("src");
        let setResult = setCodeRegex.exec(setUrl);
        if(setResult && setResult.length >= 2){
            setDeetz.code = setResult[1];
        }
        
        let searchText = this.$("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContentHeader_searchTermDisplay").text();
        let cardCountResult = cardCountRegex.exec(searchText);
        if(cardCountResult && cardCountResult.length >= 2){
            setDeetz.numberCards = Number(cardCountResult[1]);
        }else{
            setDeetz.numberCards = 0;
        }

        setDeetz.cards = [];

        let cardDivs = this.$(".cardItem");
        cardDivs.each((_i, cardDiv) => {
            let cardDeetz = this.ParseOneCard(cardDiv);
            setDeetz.cards.push(cardDeetz);
        });

        return setDeetz;
    } 

    private ParseOneCard(cardDiv: CheerioElement): CardSearchCardDetails{
        let cardDeetz: CardSearchCardDetails = {} as any;
        this.ParseOneCardName(cardDeetz, cardDiv);
        this.ParseOneCardText(cardDeetz, cardDiv);
        this.ParseOneCardTypes(cardDeetz, cardDiv);
        this.ParseOneCardRarity(cardDeetz, cardDiv);
        this.ParseOneCardCost(cardDeetz, cardDiv);
        this.ParseOneCardMultiverseId(cardDeetz, cardDiv);

        return cardDeetz;
    }

    private ParseOneCardTypes(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        let typeLine = this.$(cardDiv).find(".typeLine").text().trim();
        let typeResult = cardTypesRegex.exec(typeLine);
        if(typeResult){
            let typesAndSuperTypes = typeResult[1];
            let subTypes = typeResult[2];
            let numberA = typeResult[3];
            let numberB = typeResult[4];

            if(numberA && numberB){
                cardDeetz.power = numberA.trim();
                cardDeetz.toughness = numberB.trim();
            }
            else if(numberA){
                cardDeetz.loyalty = numberA.trim();
            }

            if(typesAndSuperTypes){
                let individualTypes = typesAndSuperTypes.split(" ");
                for(let type of individualTypes){
                    if(this.IsSuperType(type)){
                        cardDeetz.superTypes = cardDeetz.superTypes || [];
                        cardDeetz.superTypes.push(type);
                    }else{
                        cardDeetz.types = cardDeetz.types || [];
                        cardDeetz.types.push(type);
                    }
                }
            }

            if(subTypes){
                cardDeetz.subTypes = subTypes.trim().split(" ");
            }
        }
    }

    private ParseOneCardRarity(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        let setSymbolImg = this.$(cardDiv).find("td.rightCol img").first();
        let setSrcStr = setSymbolImg.attr("src");
        let rarityResult = cardRarityRegex.exec(setSrcStr);
        if(rarityResult && rarityResult.length >= 2){
            cardDeetz.rarity = rarityResult[1] as MTGCardRarity;
        }
    }

    private ParseOneCardText(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        cardDeetz.text = this.TextWithManaSymbols(this.$(cardDiv).find(".rulesText").first());
    }

    private ParseOneCardCost(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        cardDeetz.cost = {};

        this.$(cardDiv).find(".manaCost > img").each((_i, ele) => {
            let srcStr = ele.attribs["src"];
            let costResult = cardCostRegex.exec(srcStr);
            if(costResult && costResult.length >= 2){
                let costSymbol = costResult[1];
                let numericCost = Number(costSymbol); 
                if(!isNaN(numericCost)){
                    cardDeetz.cost[MTGCostType.Colorless] = numericCost;
                }else{
                    let costFound = false;
                    for(let potentialCost of Object.keys(MTGCostType)){
                        if(MTGCostType[potentialCost] === costSymbol){
                            costFound = true;
                            break;
                        }
                    }

                    if(costFound){
                        cardDeetz.cost[costSymbol] = cardDeetz.cost[costSymbol] || 0;
                        cardDeetz.cost[costSymbol]++;
                    }else{
                        console.error("UNRECOGNIZED COST TYPE \"" + costSymbol + "\" FROM \"" + srcStr + "\"");
                    }
                }
            }
        });
    }

    private ParseOneCardMultiverseId(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        let imgEle = this.$(cardDiv).find("td.leftCol img").first();
        let srcStr = imgEle.attr("src");
        let midResult = midRegex.exec(srcStr);
        if(midResult && midResult.length >= 2){
            cardDeetz.multiverseId = midResult[1];
        }
    }

    private ParseOneCardName(cardDeetz: CardSearchCardDetails, cardDiv: CheerioElement): void{
        let rawName = this.$(cardDiv).find(".cardTitle > a").text().trim();
        let nameResult = cardSplitNameRegex.exec(rawName);
        if(nameResult && nameResult.length >= 3 && nameResult[2]){
            cardDeetz.name = nameResult[2].trim();
        }else{
            cardDeetz.name = rawName;
        }
    }

    private IsSuperType(candidate: string): boolean{
        for(let superType in MTGCardSuperType){
            if(candidate === superType){
                return true;
            }
        }

        return false;
    }

    private TextWithManaSymbols(ele: Cheerio): string{
        ele.find("img").each((_i, costEle) => {
            let srcStr = costEle.attribs["src"];
            let costResult = cardCostRegex.exec(srcStr);
            this.$(costEle).replaceWith("{" + costResult[1] + "}");
        });
        
        ele.find("p").each((_i, pEle) => {
            this.$(pEle).replaceWith(this.$(pEle).text() + "\r\n");
        });
        
        return ele.text().trim();
    }
}