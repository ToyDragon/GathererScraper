export default interface MTGSet{

}

export interface MTGSetDetails{
    code: string;
    name: string;
    numberCards: number;
}

export interface MTGSetIDMap extends MTGIDToValueMap<string>{};

interface MTGIDToValueMap<K>{
    [cardId: string]: K[];
}