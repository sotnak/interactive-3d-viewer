import * as THREE from "three";
import getParentElement from "../misc/getParentElement";

function onWindowResizeBuilder(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {

    const parent = getParentElement(canvas)

    return () => {
        camera.aspect = parent.clientWidth / parent.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(parent.clientWidth, parent.clientHeight);
    };

}

export function build(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const parent = getParentElement(canvas)

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setSize( parent.clientWidth, parent.clientHeight );
    renderer.shadowMap.enabled = true;

    return renderer;
}

export function enableResizing(canvas: HTMLCanvasElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer){
    const parent = getParentElement(canvas)

    new ResizeObserver(onWindowResizeBuilder(canvas, camera, renderer)).observe(parent);
}