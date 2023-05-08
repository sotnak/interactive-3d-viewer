import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

export interface Controls extends THREE.EventDispatcher{
    reset(): void
    dispose(): void
    update(): void

    target: THREE.Vector3
    rotateSpeed : Number
    panSpeed : Number
    zoomSpeed : Number
}

export enum ControlsOption{
    Orbit,
    Trackball
}

export function build(canvas: HTMLCanvasElement, camera: THREE.Camera, option: ControlsOption = ControlsOption.Orbit): Controls {
    switch (option){
        case ControlsOption.Orbit:
            return new OrbitControls(camera, canvas);

        case ControlsOption.Trackball:
            return new TrackballControls( camera, canvas );

        default:
            throw new Error("Unknown controls option")
    }
}