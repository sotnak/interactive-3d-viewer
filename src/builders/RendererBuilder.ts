import * as THREE from "three";
import getParentElement from "../misc/getParentElement";

export function build(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const parent = getParentElement(canvas)

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    //16px for loading bar
    renderer.setSize( parent.clientWidth, parent.clientHeight > 16 ? parent.clientHeight - 16 : 1 );
    renderer.shadowMap.enabled = true;

    return renderer;
}