import * as THREE from "three";
import Intersection from "../misc/Intersection";
import Cursor from "./Cursor";

export class LineCursor implements Cursor{
    private readonly line: THREE.Line<any, THREE.LineBasicMaterial>;
    constructor(line: THREE.Line<any, THREE.LineBasicMaterial>) {
        this.line = line
    }
    getObject3D(): THREE.Object3D {
        return this.line
    }

    projectCursor(intersects:  THREE.Intersection<THREE.Object3D<THREE.Event>>[], intersection: Intersection, loadedModel: THREE.Group){

        if(!intersection.point || !intersection.normal)
            throw new Error('unable to project cursor')

        const p = intersects[ 0 ].point;
        intersection.point?.copy( p );

        // @ts-ignore
        const n = intersects[0].face.normal.clone();
        n.transformDirection( loadedModel.matrixWorld );
        n.multiplyScalar( 10 );
        n.add( intersects[ 0 ].point );

        // @ts-ignore
        intersection.normal.copy( intersects[ 0 ].face.normal );

        const positions = this.line.geometry.attributes.position;
        positions.setXYZ( 0, p.x, p.y, p.z );
        positions.setXYZ( 1, n.x, n.y, n.z );
        positions.needsUpdate = true;

        intersects.length = 0;

        this.line.visible = true;
    }
    hideCursor(){
        this.line.visible = false;
    }
}