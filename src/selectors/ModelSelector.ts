import * as THREE from "three"

export enum ComparableState{
    default,
    active,
    inactive
}

export interface ComparableModel{
    model: THREE.Group,
    state: ComparableState
}

export default interface ModelSelector{
    activate(model: ComparableModel): void
    deactivate(model: ComparableModel): void
    reset(model: ComparableModel): void
}