import Intersection from "../misc/Intersection";
import * as THREE from "three";

export enum CursorType{
    cursor3D,
    cursor2D
}

export interface Cursor{
    projectCursor(intersection: Intersection, loadedModel: THREE.Group): void
    hideCursor(): void
    getObject3D(): THREE.Object3D
    type: CursorType
}

export abstract class Cursor3D implements Cursor{
    type: CursorType = CursorType.cursor3D;
    abstract getObject3D(): THREE.Object3D;

    abstract hideCursor(): void;

    abstract projectCursor(intersection: Intersection, loadedModel: THREE.Group): void;
}

export abstract class Cursor2D implements Cursor{
    type: CursorType = CursorType.cursor2D;
    abstract getObject3D(): THREE.Object3D;

    abstract hideCursor(): void;

    abstract projectCursor(intersection: Intersection, loadedModel: THREE.Group): void;
}