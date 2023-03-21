import * as THREE from "three";
import {SynchronizedAttributes} from "./Synchronizer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as CursorHelpers from "../cursors/CursorHelpers";
import {Cursor, CursorType} from "../cursors/Cursor";

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

export const setCursorPosition = (attr: SynchronizedAttributes, camera?: THREE.PerspectiveCamera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    switch (cursor?.type){
        case CursorType.cursor2D:
            setCursor2D(attr, camera, cursor, loadedModel)
            break;

        case CursorType.cursor3D:
            setCursor3D(attr, camera, cursor, loadedModel)
            break;

    }
}