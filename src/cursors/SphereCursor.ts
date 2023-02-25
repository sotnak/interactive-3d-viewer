import * as THREE from "three";
import Intersection from "../misc/Intersection";
import {Cursor3D} from "./Cursor";


export default class SphereCursor extends Cursor3D{
    private readonly sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    constructor(sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>) {
        super();
        this.sphere = sphere
    }

    getObject3D(): THREE.Object3D {
        return this.sphere;
    }

    projectCursor(intersection: Intersection, loadedModel: THREE.Group): void {
        if(!intersection.point) {
            console.warn("unable to project cursor")
            return;
        }

        this.sphere.position.set(intersection.point.x, intersection.point.y, intersection.point.z)
        this.sphere.visible = true
    }

    hideCursor(): void {
        this.sphere.visible = false;
    }

}