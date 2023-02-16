import * as THREE from "three";
import Cursor from "./Cursor";
import Intersection from "../misc/Intersection";


export default class SphereCursor implements Cursor{
    private readonly sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    constructor(sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>) {
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