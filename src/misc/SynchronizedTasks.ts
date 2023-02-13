import * as CursorHandler from "./CursorHandler";
import * as SceneBuilder from "../builders/SceneBuilder"
import * as THREE from "three";
import {SynchronizedAttributes} from "./Synchronizer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

export const setCameraPosition = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera) => {
    if(attr.cameraPosition)
        camera?.position.set(attr.cameraPosition.x, attr.cameraPosition.y, attr.cameraPosition.z)
}

export const setCameraTarget = (attr: SynchronizedAttributes, controls?: OrbitControls | TrackballControls) => {
    if(attr.cameraTarget)
        controls?.target.set(attr.cameraTarget.x, attr.cameraTarget.y, attr.cameraTarget.z)
}

export const setCursorPosition = (attr: SynchronizedAttributes, raycaster: THREE.Raycaster, camera?: THREE.PerspectiveCamera, line?: SceneBuilder.Cursor, loadedModel?: THREE.Group) => {
    if(attr.cursorPosition)
        CursorHandler.setCursor(attr.cursorPosition, raycaster, camera, line, loadedModel)
}