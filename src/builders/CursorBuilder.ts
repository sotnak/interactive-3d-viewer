import * as THREE from "three";
import Cursor from "../cursors/Cursor";
import {LineCursor} from "../cursors/LineCursor";
import SphereCursor from "../cursors/SphereCursor";
import {CursorStyleOption} from "../cursors/Enums";

export function build(scene: THREE.Scene, option: CursorStyleOption): Cursor{

    let geometry
    let material
    let cursor: Cursor

    switch (option){
        case CursorStyleOption.line:
            geometry = new THREE.BufferGeometry();
            geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
            material = new THREE.LineBasicMaterial({color: 0x00ff00})

            cursor = new LineCursor(new THREE.Line( geometry, material ));
            break;

        case CursorStyleOption.sphere:
            geometry = new THREE.SphereGeometry( 1, 32, 16 );
            material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

            cursor = new SphereCursor(new THREE.Mesh( geometry, material ))
            break;

        default:
            throw new Error("Unknown cursor style option")
    }

    cursor.hideCursor()

    scene.add(cursor.getObject3D());
    return cursor;
}