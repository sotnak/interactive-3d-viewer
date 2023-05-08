import * as THREE from "three";
import {Controls} from "../builders/ControlsBuilder";

export enum CameraPositions{
    left,
    right,
    front,
    rear,
    up
}

function leftCamera(camera: THREE.Camera, controls: Controls){
    const distance = camera.position.distanceTo(controls.target)
    const n_position = new THREE.Vector3(-distance,0,0).add(controls.target)
    camera.position.set(n_position.x, n_position.y, n_position.z)
}

function rightCamera(camera: THREE.Camera, controls: Controls){
    const distance = camera.position.distanceTo(controls.target)
    const n_position = new THREE.Vector3(distance,0,0).add(controls.target)
    camera.position.set(n_position.x, n_position.y, n_position.z)
}

function frontCamera(camera: THREE.Camera, controls: Controls){
    const distance = camera.position.distanceTo(controls.target)
    const n_position = new THREE.Vector3(0,0,distance).add(controls.target)
    camera.position.set(n_position.x, n_position.y, n_position.z)
}

function rearCamera(camera: THREE.Camera, controls: Controls){
    const distance = camera.position.distanceTo(controls.target)
    const n_position = new THREE.Vector3(0,0,-distance).add(controls.target)
    camera.position.set(n_position.x, n_position.y, n_position.z)
}

function upCamera(camera: THREE.Camera, controls: Controls){
    const distance = camera.position.distanceTo(controls.target)
    const n_position = new THREE.Vector3(0,distance,0).add(controls.target)
    camera.position.set(n_position.x, n_position.y, n_position.z)
}

export function moveCamera(position: CameraPositions, camera: THREE.Camera, controls: Controls){
    switch (position) {
        case CameraPositions.left:
            leftCamera(camera, controls)
            break;
        case CameraPositions.right:
            rightCamera(camera, controls)
            break;
        case CameraPositions.front:
            frontCamera(camera, controls)
            break;
        case CameraPositions.rear:
            rearCamera(camera, controls)
            break;
        case CameraPositions.up:
            upCamera(camera, controls)
            break;
        default:
            throw new Error("Unknown camera position")
    }
}