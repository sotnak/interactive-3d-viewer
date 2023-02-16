import * as THREE from "three";
import {SynchronizedAttributes} from "./Synchronizer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import Cursor, * as CursorHelpers from "../cursors/Cursor";
import {LineCursor} from "../cursors/LineCursor";
import SphereCursor from "../cursors/SphereCursor";

export const setCameraPosition = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera) => {
    if(attr.cameraPosition)
        camera?.position.set(attr.cameraPosition.x, attr.cameraPosition.y, attr.cameraPosition.z)
}

export const setCameraTarget = (attr: SynchronizedAttributes, controls?: OrbitControls | TrackballControls) => {
    if(attr.cameraTarget)
        controls?.target.set(attr.cameraTarget.x, attr.cameraTarget.y, attr.cameraTarget.z)
}

const setCursor2D = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    if(!attr.cursor2D)
        return;

    if(!attr.cursor2D.visible){
        cursor?.hideCursor()
        return;
    }

    if(attr.cursor2D.position)
        CursorHelpers.setCursorFromPointer(attr.cursor2D.position, camera, cursor, loadedModel)
}

const setCursor3D = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    if(!attr.cursor3D)
        return;

    if(!attr.cursor3D.visible){
        cursor?.hideCursor()
        return;
    }

    if(attr.cursor3D.position)
        CursorHelpers.setCursorFrom3DPoint(attr.cursor3D.position, camera, cursor, loadedModel)
}

export const setCursor = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    switch (cursor?.constructor){
        case LineCursor:
            setCursor2D(attr, camera, cursor, loadedModel)
            break;

        case SphereCursor:
            setCursor3D(attr, camera, cursor, loadedModel)
            break;

    }
}