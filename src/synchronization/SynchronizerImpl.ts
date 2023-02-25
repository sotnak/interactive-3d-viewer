import Synchronizer, {SynchronizedAttributes} from "./Synchronizer";

interface Target {
    id: number
    synchronize: (attr: SynchronizedAttributes) => void
}

export default class SynchronizerImpl implements Synchronizer{
    private targets: Target[] = []
    private attributes?: SynchronizedAttributes

    register( id: number, synchronize: (attr: SynchronizedAttributes) => void ){
        this.targets.push({id, synchronize})
    }

    remove(id:number){
        this.targets = this.targets.filter(t => t.id != id)
    }

    update( id: number, attributes: SynchronizedAttributes ){
        this.attributes = attributes

        for(const t of this.targets){
            if(id !== t.id)
                t.synchronize(attributes)
        }
    }

    getSynchronizedAttributes(): SynchronizedAttributes | undefined{
        if(!this.attributes)
            return undefined;

        return JSON.parse(JSON.stringify(this.attributes))
    }
}