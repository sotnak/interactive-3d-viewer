import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const groupName = "loaded model"

THREE.Cache.enabled = true

export enum ModelFormat{
    gltf='gltf',
    fbx='fbx',
    obj='obj'
}

export interface Model{
    url: string,
    format: ModelFormat
}

function standardToLambert(material: THREE.MeshStandardMaterial){

    return new THREE.MeshLambertMaterial({
        color: material.color,
        emissive: material.emissive,
        emissiveMap: material.emissiveMap,
        //roughness: material.roughness,
        //roughnessMap: material.roughnessMap,
        //metalness: material.metalness,
        //metalnessMap: material.metalnessMap,
        map: material.map,
        lightMap: material.lightMap,
        aoMap: material.aoMap,
        normalMap: material.normalMap ?? undefined,
        bumpMap: material.bumpMap ?? undefined,
        displacementMap: material.displacementMap ?? undefined,
        envMap: material.envMap,
        alphaMap: material.alphaMap,
        opacity: material.opacity,
        fog: material.fog,
    })
}

function processObject3D( object: THREE.Object3D ) {
    //light stripes - casting & receiving shadows
    object.castShadow = true;
    object.receiveShadow = true;

    //object.matrixWorldNeedsUpdate = true;

    //@ts-ignore
    if (object.isMesh) {
        //@ts-ignore
        object.material.fog = false;

        //fixes dark models
        //@ts-ignore
        object.material.metalness = 0;

        //needed for switching between selectors
        //@ts-ignore
        object.material.transparent = true;
    }
}

async function loadGLTF(url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene, onProgress?: (event: ProgressEvent<EventTarget>) => void ){
    const loader = new GLTFLoader();
    loader.setRequestHeader(requestHeaders)

    const gltf = await loader.loadAsync(url, onProgress)

    gltf.scene.traverse( processObject3D );

    gltf.scene.name=groupName

    //removeLoaded(scene);
    scene.add( gltf.scene );
    return gltf.scene;
}

async function modelLoad(loader: FBXLoader | OBJLoader, url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
    loader.setRequestHeader(requestHeaders)

    const group = await loader.loadAsync(url, onProgress)

    group.traverse( processObject3D );

    group.name=groupName
    scene.add( group );
    return group;
}

export async function load(modelFormat: ModelFormat, url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
    const loadingManager = new THREE.LoadingManager();
    /*loadingManager.setURLModifier( function( url ) {
        if(url.endsWith('.png'))
            return '';

        return url;
    } );*/

    switch (modelFormat) {
        case ModelFormat.fbx:
            return modelLoad(new FBXLoader(loadingManager), url, requestHeaders, scene, onProgress);
        case ModelFormat.obj:
            return modelLoad(new OBJLoader(loadingManager), url, requestHeaders, scene, onProgress);
        case ModelFormat.gltf:
            return loadGLTF(url, requestHeaders, scene, onProgress);
        default:
            throw new Error("Unsupported model format");
    }
}

export function removeLoaded(scene: THREE.Scene){
    const olds = scene.children.filter( obj => obj.name === groupName )

    if(olds.length > 0)
        scene.remove(...olds)
}