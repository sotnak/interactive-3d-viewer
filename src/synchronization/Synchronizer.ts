import * as THREE from "three";

export interface SynchronizedAttributes{
    cameraPosition?: THREE.Vector3
    cameraTarget?: THREE.Vector3

    cameraZoom?: number
    cursor2D?: {
        position?: THREE.Vector2
        visible: boolean
    }
    cursor3D?: {
        position?: THREE.Vector3
        visible: boolean
    }
}

export default interface Synchronizer{
    register( id: number, synchronize: (msg: SynchronizedAttributes) => void ): void

    remove(id:number): void

    update( msg: SynchronizedAttributes, id?: number ): void
}