import ModelViewLogic from "./ModelViewLogic";
import ModelSelector, {ComparableModel, ComparableState} from "../selectors/ModelSelector";
import * as SelectorBuilder from "../builders/SelectorBuilder";
import {Model} from "../loading/ModelLoader";
import {LoadingCallbacksHandler} from "../loading/LoadingCallbacksHandler";


export default class ModelCompareLogic extends ModelViewLogic{
    protected comparableModels: ComparableModel[] = []
    protected activeModel: number = 0
    protected selector?: ModelSelector;

    async loadBoth(urls: string[], requestHeaders: { [p: string]: string }, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
        const lch = new LoadingCallbacksHandler()

        this.comparableModels[0] = {model: await this.load(urls[0], requestHeaders, lch.participate(onProgress)), state: ComparableState.default}
        this.comparableModels[1] = {model: await this.load(urls[1], requestHeaders, lch.participate(onProgress)), state: ComparableState.default}

        this.setActive(this.activeModel)
    }

    async loadBothModels(models: Model[], requestHeaders: { [p: string]: string }, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
        const lch = new LoadingCallbacksHandler()

        const model1 = this.loadModel(models[0], requestHeaders, lch.participate(onProgress))
        const model2 = this.loadModel(models[1], requestHeaders, lch.participate(onProgress))

        this.comparableModels[0] = {model: await model1, state: ComparableState.default}
        this.comparableModels[1] = {model: await model2, state: ComparableState.default}

        this.setActive(this.activeModel)
    }

    removeLoaded() {
        this.comparableModels = []
        super.removeLoaded();
    }

    setSelector(option: SelectorBuilder.SelectorOption){

        if(this.selector)
            for(const model of this.comparableModels){
                this.selector.reset(model)
            }

        console.log(this.id, "set selector:", SelectorBuilder.SelectorOption[option])

        this.selector = SelectorBuilder.build(option)

        this.setActive(this.activeModel)
    }

    setActive(n: number){

        console.log(this.id, "set active:", n)

        this.activeModel = n;

        for(let i = 0; i<this.comparableModels.length; i+=1){
            if(i == this.activeModel){
                this.selector?.activate(this.comparableModels[i])
            } else {
                this.selector?.deactivate(this.comparableModels[i])
            }
        }
    }
}