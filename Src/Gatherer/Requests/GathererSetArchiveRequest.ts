import GathererRequestBase from "./GathererRequestBase";

export default class GathererSearchPageRequest extends GathererRequestBase{
    public constructor(){
        super();
        this.host = "magic.wizards.com";
        this.path = "/en/products/card-set-archive";
    }
}