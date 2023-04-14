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

async function loadGLTF(url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene, onProgress?: (event: ProgressEvent<EventTarget>) => void ){
    const loader = new GLTFLoader();
    loader.setRequestHeader(requestHeaders)

    const gltf = await loader.loadAsync(url, onProgress)

    gltf.scene.traverse( function ( object ) {
        //light stripes - casting & receiving shadows
        object.castShadow = true;
        object.receiveShadow = true;

        //@ts-ignore
        if(object.isMesh) {
            //needed for switching between selectors
            //@ts-ignore
            object.material.transparent = true;
        }
    } );

    gltf.scene.name=groupName

    //removeLoaded(scene);
    scene.add( gltf.scene );
    return gltf.scene;
}

async function modelLoad(loader: FBXLoader | OBJLoader, url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene, onProgress?: (event: ProgressEvent<EventTarget>) => void) {
    loader.setRequestHeader(requestHeaders)

    const group = await loader.loadAsync(url, onProgress)

    group.traverse( function ( object ) {
        //light stripes - casting & receiving shadows
        object.castShadow = true;
        object.receiveShadow = true;

        //@ts-ignore
        if(object.isMesh) {
            //needed for switching between selectors
            //@ts-ignore
            object.material.transparent = true;
        }
    } );

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
    }
}

export function removeLoaded(scene: THREE.Scene){
    const old = scene.children.find( obj => obj.name === groupName )

    if(old)
        scene.remove(old)
}