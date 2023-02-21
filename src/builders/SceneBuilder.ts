import * as THREE from "three";

function buildGround(): THREE.Group{

    const group = new THREE.Group()
    group.name = "BUILDER_ground"

    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    //@ts-ignore
    grid.material.opacity = 0.2;
    //@ts-ignore
    grid.material.transparent = true;

    group.add( grid );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    group.add( mesh );

    return group;
}

function buildLights(): THREE.Group {
    const group = new THREE.Group()
    group.name = "BUILDER_lights"

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x999999 );
    hemiLight.position.set( 0, 200, 0 );
    group.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    //light stripes - casting & receiving shadows
    dirLight.shadow.bias = -0.01
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    group.add( dirLight );

    group.add(new THREE.AmbientLight(0xffffff, 0.3))

    return group;
}

export function build(): THREE.Scene{
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    scene.add(buildGround())

    scene.add(buildLights())

    return scene
}

export function buildCamera(width: number, height: number): THREE.PerspectiveCamera{
    const camera = new THREE.PerspectiveCamera( 50, width / height, 1, 1000 );
    camera.position.y = 50;
    camera.position.z = 200;

    return camera
}