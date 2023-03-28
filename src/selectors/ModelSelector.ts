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
    activateModel(model: ComparableModel): void
    deactivateModel(model: ComparableModel): void
    resetModel(model: ComparableModel): void
}