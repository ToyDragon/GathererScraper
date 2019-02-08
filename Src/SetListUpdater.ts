import GathererSearchPageRequest from "./Gatherer/Requests/GathererSearchPageRequest";
import GathererSetCardsRequest from "./Gatherer/Requests/GathererSetCardsRequest";
import * as fs from "fs";
import { CardSearchSetDetails } from "./Gatherer/Parsers/StandardCardSearchParser";
import ArgsParser from "./ArgsParser";
import StandardCardSearchParser from "./Gatherer/Parsers/StandardCardSearchParser";

const setCodeToCardIdMapFile = "./Files/SetCodeToIdMap.json";
const setDetailFile = "./Files/SetDetails.json";

let setNames: string[] = [];
let argsParser = new ArgsParser(process.argv);

function ScrapeSetDetails(): Promise<CardSearchSetDetails[]>{
    return new Promise((resolve) => {
        new GathererSearchPageRequest().Execute().then((result: CheerioStatic) => {
            let allOptions = result("#ctl00_ctl00_MainContent_Content_SearchControls_setAddText > option").toArray();
            setNames = allOptions.map((element) => { return element.attribs["value"]; }).filter((name) => {return name.length > 0;});
            console.log("Found " + setNames.length + " sets");
            let setsToExclude: {[setCode: string]: boolean} = {};
        
            let existingSetDetails = null;
            if(!argsParser.args["f"] && !argsParser.args["full"]){
                existingSetDetails = JSON.parse(fs.readFileSync(setDetailFile, "utf8")) as CardSearchSetDetails[];
                for(let setDeetz of existingSetDetails){
                    setsToExclude[setDeetz.name] = true;
                }
            }

            GatherSetDetails(setNames, setsToExclude, existingSetDetails).then((setDetails: CardSearchSetDetails[]) => {
                let stream = fs.createWriteStream(setDetailFile);
                stream.write(JSON.stringify(setDetails));
                stream.close();
                console.log("Finished updating sets");
        
                resolve(setDetails);
            });
        });
    });
}

const cardMultiverseIdRegex = /=([0-9]+)$/;

function ScrapeSingleSetCardList(setName: string, expectedCardCount: number): Promise<string[]> {
    return new Promise((resolve) => {

        let highestPage = 0;
        let cardIds = [];
        let cardsSeen = 0;
        let duplicates = 0;
        let seenIds: {[id: string]: boolean} = {};

        let pages = [0];

        AsyncIter(pages, (_i, currentPage, next) => {
            new GathererSetCardsRequest(setName, currentPage).Execute().then(($: CheerioStatic) => {
                if(currentPage === 0){
                    let pageButtons = $(".paging > a");
                    let highestPageStr = "1";
                    if(pageButtons.length > 2){
                        highestPageStr = pageButtons[pageButtons.length-2].children[0].nodeValue;
                    }
        
                    highestPage = Number(highestPageStr) || 0;
                    for(let page = 1; page < highestPage; page++){
                        pages.push(page);
                    }
                }

                let cardLinks = $(".cardItemTable .leftCol a").toArray();
                let pageMultiverseIds = cardLinks.map((element: CheerioElement) => {
                    let url = element.attribs["href"];
                    let results = cardMultiverseIdRegex.exec(url);
                    if(results && results.length >= 2){
                        return results[1];
                    }
    
                    return "";
                });

                for(let id of pageMultiverseIds){
                    if(!seenIds[id]){
                        seenIds[id] = true;
                        cardIds.push(id);
                        cardsSeen++;
                    }else{
                        duplicates++;
                    }
                }

                next(true);
            });
        }).then(()=>{
            console.log("Finished set " + setName + " with " + highestPage + " pages and " + cardsSeen + "(" + duplicates + ")" + "/" + expectedCardCount + " cards");
            resolve(cardIds);
        });
    });
}

function ScrapeSetCardList(setDetails: CardSearchSetDetails[]): Promise<{[setCode: string]: string[]}>{
    let allCardsBySet: {[setCode: string]: string[]};
    try{
        allCardsBySet = JSON.parse(fs.readFileSync(setCodeToCardIdMapFile, "utf8")) || {};
    } catch(e){
        allCardsBySet = {};
    }
    return new Promise((resolve) => {
        AsyncIter(setDetails, (_i, setDetail, next) => {
            if(allCardsBySet[setDetail.code] && allCardsBySet[setDetail.code].length > 0){
                console.log("Skipped loading cards for " + setDetail.code);
                next(true);
            }else{
                ScrapeSingleSetCardList(setDetail.name, setDetail.numberCards).then((cardIds: string[]) => {
                    allCardsBySet[setDetail.code] = cardIds;
                    next(true);
                });
            }
        }).then(() => {
            resolve(allCardsBySet);
        });
    });
}

function GatherSetDetails(setNames: string[], setsToExclude: {[setName: string]: boolean}, existingSetDetails: CardSearchSetDetails[]): Promise<CardSearchSetDetails[]>{
    return new Promise((resolve) => {
        let details: CardSearchSetDetails[] = [];

        if(existingSetDetails){
            details = existingSetDetails;
        }

        AsyncIter(setNames, (i, setName, next) => {
            if(setsToExclude[setName]){
                console.log((i+1) + "/" + setNames.length + ": " + setName + " SKIPPED");
                next(true);
            }else{
                console.log((i+1) + "/" + setNames.length + ": " + setName);
                new GathererSetCardsRequest(setName, 0).Execute().then(($: CheerioStatic) => {
                    let setDetails = new StandardCardSearchParser(setName, $).Parse();

                    details.push(setDetails);
                    next(true);
                });
            }
        }).then(() => {
            resolve(details);
        });
    });
}


ScrapeSetDetails().then((setDetails: CardSearchSetDetails[]) => {
    ScrapeSetCardList(setDetails).then((allCardsBySet: {[setCode: string]: string[]}) => {
        let stream = fs.createWriteStream(setCodeToCardIdMapFile);
        stream.write(JSON.stringify(allCardsBySet));
        stream.close();
        console.log("Finished updating set Id map");
    });
});


function AsyncIter<K>(itemList: K[], func: (index: number, item:K, next: (cont: boolean) => void) => void): Promise<void>{
    return new Promise((resolve) => {
        let currentItem = -1;
        let processNextItem = (cont: boolean) => {
            currentItem++;
            if(currentItem === itemList.length || !cont){
                resolve();
            }else{
                func(currentItem, itemList[currentItem], processNextItem);
            }

        };
        processNextItem(true);
    });
}