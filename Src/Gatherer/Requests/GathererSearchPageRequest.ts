import GathererRequestBase from "./GathererRequestBase";

export default class GathererSearchPageRequest extends GathererRequestBase{
    public constructor(){
        super();
        this.path = "/Pages/Default.aspx";
    }
}