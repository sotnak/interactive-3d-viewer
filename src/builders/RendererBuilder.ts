import * as THREE from "three";
import getParentElement from "../misc/getParentElement";

export function build(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const parent = getParentElement(canvas)

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize( parent.clientWidth, parent.clientHeight );
    renderer.shadowMap.enabled = true;

    return renderer;
}