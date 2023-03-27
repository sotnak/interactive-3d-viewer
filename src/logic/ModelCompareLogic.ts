import * as THREE from "three"
import ModelViewLogic from "./ModelViewLogic";
import RenderOrderSelector from "../selectors/RenderOrderSelector";
import ModelSelector from "../selectors/ModelSelector";


export default class ModelCompareLogic extends ModelViewLogic{
    protected loadedModels: THREE.Group[] = []
    protected activeModel: number = 0
    protected selector?: ModelSelector;

    init() {
        super.init();
        this.selector = new RenderOrderSelector()
    }

    async loadBoth(urls: string[], requestHeaders: { [p: string]: string }, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
        this.loadedModels[0] = await this.load(urls[0], requestHeaders, onProgress)
        this.loadedModels[1] = await this.load(urls[1], requestHeaders, onProgress)

        this.setActive(this.activeModel)
    }

    setActive(n: number){
        if(this.loadedModels.length==0)
            return;

        console.log(this.id, "set active:", n)

        this.activeModel = n;

        for(let i = 0; i<this.loadedModels.length; i+=1){
            if(i == this.activeModel){
                this.selector?.activateModel(this.loadedModels[i])
            } else {
                this.selector?.deactivateModel(this.loadedModels[i])
            }
        }
    }

    removeLoaded() {
        this.loadedModels = []

        super.removeLoaded();
        super.removeLoaded();
    }
}