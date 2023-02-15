import * as THREE from "three";
import Intersection from "../Intersection";

export default interface Cursor{
    projectCursor(intersects:  THREE.Intersection<THREE.Object3D<THREE.Event>>[], intersection: Intersection, loadedModel: THREE.Group): void
    hideCursor(): void
    getObject3D(): THREE.Object3D
}

export enum CursorOption{
    line
}

export const setCursor = (pointer: THREE.Vector2, raycaster: THREE.Raycaster, camera?: THREE.PerspectiveCamera, cursor?: Cursor, loadedModel?: THREE.Group): Intersection => {

    const intersection = {
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
    };

    if(!camera || !loadedModel || !cursor)
        return intersection;

    raycaster.setFromCamera( pointer, camera );

    // See if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObject( loadedModel );

    if ( intersects.length > 0 ) {
        cursor.projectCursor(intersects, intersection, loadedModel)
    } else {
        cursor.hideCursor()
    }

    return intersection
}