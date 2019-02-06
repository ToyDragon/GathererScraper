import { MTGLocale } from "../../Types/MTGLocale";
import * as querystring from "querystring";
import * as http from "http";
import * as cheerio from "cheerio";
import * as fs from "fs";

export default abstract class GathererRequestBase{

    public static LastRequest: Date;
    
    protected host: string;
    protected path: string;
    protected queryParams: {[param: string]: string};
    private headers: http.OutgoingHttpHeaders;

    public constructor(){
        this.headers = {};
        this.queryParams = {};
        this.host = "gatherer.wizards.com";
        this.SetLocale(MTGLocale.ENUS);
    }

    public SetLocale(locale: MTGLocale): void{
        this.headers["CardDatabaseSettings"]="0=0&1=" + locale + "&2=0&14=1&3=13&4=0&5=1&6=15&7=0&8=1&9=1&10=19&11=4&12=8&15=1&16=0&13=";
    }

    public Execute(): Promise<CheerioStatic>{
        return new Promise((resolve, reject) => {
            let query = "";
            for(let param in this.queryParams){
                if(query.length === 0){
                    query = "?";
                }else{
                    query += "&";
                }

                query += param + "=" + querystring.escape(this.queryParams[param]);
            }

            console.log(this.path + query);
            
            this.ThrottleRequest().then(() => {
                http.get({
                    host: this.host,
                    path: this.path + query,
                    headers: this.headers,                
                }, (res: http.IncomingMessage) => {
                    let allPageData = "";
                    res.on("data", (chunk: string) => {
                        allPageData += chunk;
                    });
                    res.on("end", () => {
                        fs.writeFileSync("./Files/LatestRequest.html", allPageData);
                        let result = cheerio.load(allPageData);
                        if(result){
                            resolve(result);
                        }else{
                            reject();
                        }
                    });
                });
            });
        });
    }

    private ThrottleRequest(): Promise<void>{
        return new Promise((resolve) => {
            if(!GathererRequestBase.LastRequest){
                resolve();
            }else{
                let ellapsed = new Date().getTime() - GathererRequestBase.LastRequest.getTime();
                GathererRequestBase.LastRequest = new Date();
                if(ellapsed < 250){
                    setTimeout(() => {
                        resolve();
                    }, 250 - ellapsed);
                }else{
                    resolve();
                }
            }
        });
    }
}