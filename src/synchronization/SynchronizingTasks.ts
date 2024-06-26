import * as THREE from "three";
import {SynchronizedAttributes} from "./Synchronizer";
import * as CursorHelpers from "../cursors/CursorHelpers";
import {Cursor, CursorType} from "../cursors/Cursor";
import {Controls} from "../builders/ControlsBuilder";

export const setCameraPosition = (attr: SynchronizedAttributes, camera?: THREE.Camera) => {
    if(attr.cameraPosition)
        camera?.position.set(attr.cameraPosition.x, attr.cameraPosition.y, attr.cameraPosition.z)
}

export const setCameraTarget = (attr: SynchronizedAttributes, controls?: Controls) => {
    if(attr.cameraTarget)
        controls?.target.set(attr.cameraTarget.x, attr.cameraTarget.y, attr.cameraTarget.z)
}

export const setCameraZoom = (attr: SynchronizedAttributes, camera?: THREE.Camera)=>{
    if(attr.cameraZoom && camera instanceof THREE.OrthographicCamera){
        camera.zoom = attr.cameraZoom;
        camera.updateProjectionMatrix();
    }
}

const setCursor2D = (attr: SynchronizedAttributes, camera?: THREE.Camera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    if(!attr.cursor2D)
        return;

    if(!attr.cursor2D.visible){
        cursor?.hideCursor()
        return;
    }

    if(attr.cursor2D.position)
        CursorHelpers.setCursorFromPointer(attr.cursor2D.position, camera, cursor, loadedModel)
}

const setCursor3D = (attr: SynchronizedAttributes, camera?: THREE.Camera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    if(!attr.cursor3D)
        return;

    if(!attr.cursor3D.visible){
        cursor?.hideCursor()
        return;
    }

    if(attr.cursor3D.position)
        CursorHelpers.setCursorFrom3DPoint(attr.cursor3D.position, camera, cursor, loadedModel)
}

export const setCursorPosition = (attr: SynchronizedAttributes, camera?: THREE.Camera, cursor?: Cursor, loadedModel?: THREE.Group) => {
    switch (cursor?.type){
        case CursorType.cursor2D:
            setCursor2D(attr, camera, cursor, loadedModel)
            break;

        case CursorType.cursor3D:
            setCursor3D(attr, camera, cursor, loadedModel)
            break;

    }
}