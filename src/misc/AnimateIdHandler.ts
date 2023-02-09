let lastCaller = 0;
const validAnimates: number[] = [];

export function getCallerId(){
    lastCaller++;
    return lastCaller;
}

export function registerNewAnimate(callerId: number){
    if(!validAnimates[callerId])
        validAnimates[callerId]=0

    validAnimates[callerId]++;
    return validAnimates[callerId];
}

export function getValidAnimate(callerId: number){
    return validAnimates[callerId];
}