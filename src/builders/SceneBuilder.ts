import * as THREE from "three";

function buildGround(ground?: GroundParams, grid?: GridParams): THREE.Group{

    const group = new THREE.Group()
    group.name = "BUILDER_ground"

    const gridHelper = new THREE.GridHelper( 2000, 20, RGBToString(grid?.color) ?? 0x000000, RGBToString(grid?.color) ?? 0x000000 );
    //@ts-ignore
    gridHelper.material.opacity = 0.2;
    //@ts-ignore
    gridHelper.material.transparent = true;

    group.add( gridHelper );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: RGBToString(ground?.color) ?? 0x999999, depthWrite: true } ) );
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

function rebuildScene(scene: THREE.Scene, fog?:FogParams){
    scene.background = new THREE.Color( RGBToString(fog?.color) ?? 0xa0a0a0 );
    scene.fog = new THREE.Fog( RGBToString(fog?.color) ?? 0xa0a0a0, fog?.near ?? 200,  fog?.far ??1000 );
}

function RGBToString(rgb?: RGBColor){
    return rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : undefined
}

interface RGBColor{
    r: number
    g:number
    b:number
}

interface FogParams{
    color: RGBColor
    near?: number
    far?: number
}

interface GroundParams{
    color: RGBColor
}

interface GridParams{
    color: RGBColor
}

export interface EnvironmentParams{
    fog?: FogParams
    ground?: GroundParams
    grid?: GridParams
}

export function build(): THREE.Scene{

    const scene = new THREE.Scene();

    rebuildScene(scene);

    scene.add(buildLights())

    return scene
}

export function rebuild(scene: THREE.Scene, envParam?: EnvironmentParams){
    rebuildScene(scene, envParam?.fog)

    const oldGround = scene.children.find( obj => obj.name === "BUILDER_ground" )

    if(oldGround)
        scene.remove(oldGround)

    scene.add(buildGround( envParam?.ground, envParam?.grid ))
}