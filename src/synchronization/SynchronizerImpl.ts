import Synchronizer, {SynchronizedAttributes} from "./Synchronizer";

interface Target {
    id: number
    synchronize: (msg: SynchronizedAttributes) => void
}

export default class SynchronizerImpl implements Synchronizer{
    private targets: Target[] = []
    private attributes?: SynchronizedAttributes

    register( id: number, synchronize: (msg: SynchronizedAttributes) => void ){
        this.targets.push({id, synchronize})
    }

    remove(id:number){
        this.targets = this.targets.filter(t => t.id != id)
    }

    update( msg: SynchronizedAttributes, id?: number ){
        this.attributes = msg

        for(const t of this.targets){
            if(id !== t.id)
                t.synchronize(msg)
        }
    }

    getSynchronizedAttributes(): SynchronizedAttributes | undefined{
        if(!this.attributes)
            return undefined;

        return JSON.parse(JSON.stringify(this.attributes))
    }
}