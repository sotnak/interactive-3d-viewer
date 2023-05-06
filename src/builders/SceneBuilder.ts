import * as THREE from "three";

interface RGBColor{
    r: number
    g:number
    b:number
}

interface FogParams{
    color?: RGBColor
    near?: number
    far?: number
}

interface GroundParams{
    color?: RGBColor
    depthWrite?: boolean
}

interface GridParams{
    color: RGBColor
}

export interface EnvironmentParams{
    fog?: FogParams
    ground?: GroundParams
    grid?: GridParams
}

function buildGround(ground?: GroundParams, grid?: GridParams): THREE.Group{

    const group = new THREE.Group()
    group.name = "BUILDER_ground"

    const gridHelper = new THREE.GridHelper( 2000, 20, RGBToString(grid?.color) ?? 0x000000, RGBToString(grid?.color) ?? 0x000000 );
    //@ts-ignore
    gridHelper.material.opacity = 0.2;
    //@ts-ignore
    gridHelper.material.transparent = true;

    group.add( gridHelper );

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshLambertMaterial( { color: RGBToString(ground?.color) ?? 0x999999, depthWrite: ground?.depthWrite ?? true } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    group.add( mesh );

    return group;
}

function lightSpam(intensity: number = 1): THREE.Group {

    const group = new THREE.Group()
    group.name = "BUILDER_lightSpam"

    const dirLight1 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight1.position.set( -10, 0, 0 );
    group.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight2.position.set( 10, 0, 0 );
    group.add( dirLight2 );

    const dirLight3 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight3.position.set( 0, -10, 0 );
    group.add( dirLight3 );

    const dirLight4 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight4.position.set( 0, 10, 0 );
    group.add( dirLight4 );

    const dirLight5 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight5.position.set( 0, 0, -10 );
    group.add( dirLight5 );

    const dirLight6 = new THREE.DirectionalLight( 0xffffff, intensity );
    dirLight6.position.set( 0, 0, 10 );
    group.add( dirLight6 );

    return group;
}

function buildLights(): THREE.Group {
    const group = new THREE.Group()
    group.name = "BUILDER_lights"

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x999999, 0.7 );
    hemiLight.position.set( 0, 200, 0 );
    group.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
    dirLight.position.set( 0, 15, 10 );
    dirLight.castShadow = true;
    //light stripes - casting & receiving shadows
    dirLight.shadow.bias = -0.01
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    group.add( dirLight );

    //group.add( lightSpam(0.1) )

    group.add(new THREE.AmbientLight(0xffffff, 0.3))

    return group;
}

function rebuildScene(scene: THREE.Scene, fog?:FogParams): void{
    scene.background = new THREE.Color( RGBToString(fog?.color) ?? 0xa0a0a0 );
    scene.fog = new THREE.Fog( RGBToString(fog?.color) ?? 0xa0a0a0, fog?.near ?? 200,  fog?.far ??1000 );
}

function RGBToString(rgb?: RGBColor){
    return rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : undefined
}

export function build(): THREE.Scene{

    const scene = new THREE.Scene();

    rebuildScene(scene);

    scene.add(buildLights())

    return scene
}

export function rebuild(scene: THREE.Scene, envParam?: EnvironmentParams): void{
    rebuildScene(scene, envParam?.fog)

    const oldGround = scene.children.find( obj => obj.name === "BUILDER_ground" )

    if(oldGround)
        scene.remove(oldGround)

    scene.add(buildGround( envParam?.ground, envParam?.grid ))
}