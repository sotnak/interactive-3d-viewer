import * as THREE from "three";
import Intersection from "../misc/Intersection";
import {Cursor2D} from "./Cursor";

export class LineCursor extends Cursor2D{
    private readonly line: THREE.Line<any, THREE.LineBasicMaterial>;
    constructor(line: THREE.Line<any, THREE.LineBasicMaterial>) {
        super()
        this.line = line
    }
    getObject3D(): THREE.Object3D {
        return this.line
    }

    projectCursor(intersection: Intersection, loadedModel: THREE.Group){

        if(!intersection.point || !intersection.normal) {
            console.warn("unable to project cursor")
            return;
        }

        const p = intersection.point.clone();
        let n = intersection.normal.clone()

        n.transformDirection( loadedModel.matrixWorld );
        n.multiplyScalar( 10 );
        n.add( p );

        const positions = this.line.geometry.attributes.position;
        positions.setXYZ( 0, p.x, p.y, p.z );
        positions.setXYZ( 1, n.x, n.y, n.z );
        positions.needsUpdate = true;

        this.line.visible = true;
    }
    hideCursor(){
        this.line.visible = false;
    }
}