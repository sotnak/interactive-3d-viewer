import * as THREE from "three";
import Intersection from "../misc/Intersection";
import {Cursor} from "./Cursor";

function getIntersection(intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]): Intersection{

    if(intersects.length == 0)
        return {};

    const intersection: Intersection = {
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
    }

    const p = intersects[0].point;
    intersection.point?.copy( p );

    //@ts-ignore
    const n = intersects[0].face.normal
    intersection.normal?.copy( n );

    intersects.length=0;

    return intersection;
}

export const setCursorFromPointer = (pointer: THREE.Vector2, camera?: THREE.Camera, cursor?: Cursor, loadedModel?: THREE.Group, hideOnMiss: boolean = true): Intersection => {

    if(!camera || !loadedModel || !cursor)
        return {};

    const raycaster = new THREE.Raycaster()

    raycaster.setFromCamera( pointer, camera );

    // See if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObject( loadedModel );
    const intersection = getIntersection(intersects)

    if ( intersection.point ) {
        cursor.projectCursor(intersection, loadedModel)
    } else if(hideOnMiss) {
        cursor.hideCursor()
    }

    return intersection
}

export const setCursorFrom3DPoint = (position: THREE.Vector3, camera?: THREE.Camera, cursor?: Cursor, loadedModel?: THREE.Group, hideOnMiss: boolean = true): Intersection => {

    if(!camera || !loadedModel || !cursor)
        return {};

    const intersection = {point: position}

    if ( intersection.point ) {
        cursor.projectCursor(intersection, loadedModel)
    } else if(hideOnMiss) {
        cursor.hideCursor()
    }

    return intersection
}