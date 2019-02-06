import ParserBase from "./ParserBase";

interface CardDetails{

}

export default class CardDetailsParser extends ParserBase{

    public constructor($: CheerioStatic) {
        super($);
    }

    public Parse(): CardDetails{
        let deetz: CardDetails = {};

        return deetz;
    } 

}