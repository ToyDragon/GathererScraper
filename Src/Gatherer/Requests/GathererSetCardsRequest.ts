import GathererRequestBase from "./GathererRequestBase";

export default class GathererSearchPageRequest extends GathererRequestBase{
    public constructor(setName: string, page?: number){
        super();
        if(!page){
            page = 0;
        }
        this.path = "/Pages/Search/Default.aspx";
        this.queryParams["page"] = page.toString();
        this.queryParams["set"] = "[" + setName.replace(/ /g, "+") + "]";
    }
}