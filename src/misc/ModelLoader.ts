import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const groupName = "loaded model"

THREE.Cache.enabled = true

export async function loadGLTF(url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene){
    const loader = new GLTFLoader();
    loader.setRequestHeader(requestHeaders)

    const gltf = await loader.loadAsync(url)

    const group = new THREE.Group()

    group.name=groupName

    gltf.scene.traverse( function ( object ) {
        //light stripes - casting & receiving shadows
        object.castShadow = true;
        object.receiveShadow = true;

        group.add(object)
    } );

    removeLoaded(scene);
    scene.add( group );
}

export function removeLoaded(scene: THREE.Scene){
    const old = scene.children.find( obj => obj.name === groupName )

    if(old)
        scene.remove(old)
}