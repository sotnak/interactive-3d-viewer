import * as THREE from "three";
import getParentElement from "./getParentElement";

function onWindowResizeBuilder(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {

    const parent = getParentElement(canvas)

    return () => {

        renderer.setSize(parent.clientWidth, parent.clientHeight);

        const bounds = canvas.getBoundingClientRect()

        if(camera instanceof THREE.PerspectiveCamera) {
            camera.aspect = bounds.width / bounds.height;
        }

        if(camera instanceof THREE.OrthographicCamera) {

            const frustumSize = 5;

            const aspect = bounds.height / bounds.width;

            camera.left = frustumSize / - 2;
            camera.right = frustumSize / 2;
            camera.top = frustumSize * aspect / 2;
            camera.bottom = - frustumSize * aspect / 2;
        }

        // @ts-ignore
        camera.updateProjectionMatrix();
    };

}

export function getResizeObserver(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer?: THREE.WebGLRenderer){

    if(!renderer)
        throw new Error("Renderer undefined")

    return new ResizeObserver(onWindowResizeBuilder(canvas, camera, renderer))
}