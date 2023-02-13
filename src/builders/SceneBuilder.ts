import * as THREE from "three";

function buildGround(scene: THREE.Scene){
    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    //@ts-ignore
    grid.material.opacity = 0.2;
    //@ts-ignore
    grid.material.transparent = true;

    scene.add( grid );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
}

function buildLight(scene: THREE.Scene){
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x999999 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    //light stripes - casting & receiving shadows
    dirLight.shadow.bias = -0.01
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
}

export function build(){
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    buildGround(scene)

    buildLight(scene)

    return scene
}

export function buildCamera(width: number, height: number){
    const camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;

    return camera
}