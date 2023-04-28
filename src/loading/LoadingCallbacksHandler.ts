class Participant{
    loaded: number = 0;
    total: number = 0;

    constructor(size?: number) {
        if(size)
            this.total = size
    }

    onProgress(loaded: number, total: number){
        this.loaded = loaded

        if(this.total<=0)
            this.total = total
    }
}
export class LoadingCallbacksHandler {
    private participants: Participant[] = []

    private accumulate(accumulator: Participant, value: Participant){
        accumulator.loaded += value.loaded
        accumulator.total += value.total

        return accumulator
    }

    participate( onProgress?: (event: ProgressEvent<EventTarget>)=>void, size?: number ){
        if(!onProgress)
            return undefined

        const participant: Participant = new Participant(size)
        this.participants.push(participant)

        return (event: ProgressEvent<EventTarget>)=>{
            participant.onProgress(event.loaded, event.total)
            const accumulated = this.participants.reduce( this.accumulate, new Participant() )

            console.log(accumulated)

            onProgress(  new ProgressEvent(event.type, {
                loaded: accumulated.loaded,
                total: accumulated.total
            }) )
        }
    }
}