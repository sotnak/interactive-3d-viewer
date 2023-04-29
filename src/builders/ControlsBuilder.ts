import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

export interface Controls extends THREE.EventDispatcher{
    reset(): void
    dispose(): void
    update(): void

    target: THREE.Vector3
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
            const track = new TrackballControls( camera, canvas );
            track.zoomSpeed = 0.1
            return track
    }
}