import ModelViewLogic from "./ModelViewLogic";
import RenderOrderSelector from "../selectors/RenderOrderSelector";
import ModelSelector, {ComparableModel, ComparableState} from "../selectors/ModelSelector";
import * as SelectorBuilder from "../builders/SelectorBuilder";


export default class ModelCompareLogic extends ModelViewLogic{
    protected comparableModels: ComparableModel[] = []
    protected activeModel: number = 0
    protected selector?: ModelSelector;

    init() {
        super.init();
        this.selector = new RenderOrderSelector()
    }

    async loadBoth(urls: string[], requestHeaders: { [p: string]: string }, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
        this.comparableModels[0] = {model: await this.load(urls[0], requestHeaders, onProgress), state: ComparableState.default}
        this.comparableModels[1] = {model: await this.load(urls[1], requestHeaders, onProgress), state: ComparableState.default}

        this.setActive(this.activeModel)
    }

    removeLoaded() {
        this.comparableModels = []

        super.removeLoaded();
        super.removeLoaded();
    }

    setSelector(option: SelectorBuilder.SelectorOption){

        if(this.selector)
            for(const model of this.comparableModels){
                this.selector.resetModel(model)
            }

        console.log(this.id, "set selector:", SelectorBuilder.SelectorOption[option])

        this.selector = SelectorBuilder.build(option)

        this.setActive(this.activeModel)
    }

    setActive(n: number){
        if(this.comparableModels.length==0 || !this.selector)
            return;

        console.log(this.id, "set active:", n)

        this.activeModel = n;

        for(let i = 0; i<this.comparableModels.length; i+=1){
            if(i == this.activeModel){
                this.selector.activateModel(this.comparableModels[i])
            } else {
                this.selector.deactivateModel(this.comparableModels[i])
            }
        }
    }
}