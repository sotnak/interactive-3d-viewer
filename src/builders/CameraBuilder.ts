import * as THREE from "three";

export enum CameraOption{
    perspective,
    orthographic
}

export const defaultPosition = new THREE.Vector3(0,25, 125)

export function build(cameraOption: CameraOption = CameraOption.perspective): THREE.Camera{

    let camera: THREE.Camera;

    switch (cameraOption){
        case CameraOption.perspective:
            camera = new THREE.PerspectiveCamera( 70 );
            //@ts-ignore
            camera.far = Number.MAX_SAFE_INTEGER; camera.near = 0.5;
            camera.position.x = defaultPosition.x;
            camera.position.y = defaultPosition.y;
            camera.position.z = defaultPosition.z;
            break;
        case CameraOption.orthographic:
            camera = new THREE.OrthographicCamera();
            //@ts-ignore
            camera.zoom = 0.05; camera.far = 2000; camera.near = 0.5;
            camera.position.x = defaultPosition.x;
            //camera.position.y = defaultPosition.y;
            camera.position.z = defaultPosition.z;
            break;

        default:
            throw new Error("Unknown camera option");
    }

    return camera
}