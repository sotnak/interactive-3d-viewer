import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export function loadGLTF(url: string, requestHeaders: {[p: string]: string}, scene: THREE.Scene){
    const loader = new GLTFLoader();
    loader.setRequestHeader(requestHeaders)

    loader.load(url,(gltf)=>{
        gltf.scene.traverse( function ( object ) {
            //light stripes - casting & receiving shadows
            object.castShadow = true;
            object.receiveShadow = true;
        } );

        scene.add( gltf.scene );
    })
}