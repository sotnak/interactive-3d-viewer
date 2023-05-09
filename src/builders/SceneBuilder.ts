import * as THREE from "three";
import EnvironmentParams, {
    dim,
    FogParams,
    GridParams,
    GroundParams,
    LightParams,
    RGBToString
} from "../misc/EnvironmentParams";

const defaultGroundColor = 0x999999
const defaultFogColor = 0xa0a0a0

function buildGround(ground?: GroundParams, grid?: GridParams): THREE.Group{

    const group = new THREE.Group()
    group.name = "BUILDER_ground"

    const gridHelper = new THREE.GridHelper( 2000, 20, RGBToString(grid?.color) ?? 0x000000, RGBToString(grid?.color) ?? 0x000000 );
    //@ts-ignore
    gridHelper.material.opacity = 0.2;
    //@ts-ignore
    gridHelper.material.transparent = true;
    group.add( gridHelper );

    if(grid?.showAxes) {
        const axesHelper = new THREE.AxesHelper(1000)
        //@ts-ignore
        axesHelper.material.fog = false;
        group.add(axesHelper)

        console.log(axesHelper)
    }

    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshLambertMaterial( { color: RGBToString(ground?.color) ?? defaultGroundColor, depthWrite: ground?.depthWrite ?? true } ) );
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

function buildLights(light?: LightParams, ground?: GroundParams, fog?: FogParams): THREE.Group {
    const group = new THREE.Group()
    group.name = "BUILDER_lights"

    const hemiLight = new THREE.HemisphereLight(
        RGBToString(fog?.color) ?? RGBToString(light?.color) ?? defaultFogColor,
        RGBToString(dim(ground?.color)) ?? RGBToString(dim(light?.color)) ?? defaultGroundColor,
        0.6 * (light?.intensity ?? 1) );

    hemiLight.position.set( 0, 200, 0 );
    group.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( RGBToString(light?.color) ?? 0xffffff, 0.1 * (light?.intensity ?? 1) );
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

    group.add(new THREE.AmbientLight( RGBToString(light?.color) ?? 0xffffff, 0.4 * (light?.intensity ?? 1) ))

    return group;
}

function rebuildScene(scene: THREE.Scene, fog?:FogParams): void{
    scene.background = new THREE.Color( RGBToString(fog?.color) ?? defaultFogColor );
    scene.fog = new THREE.Fog( RGBToString(fog?.color) ?? defaultFogColor, fog?.near ?? 200,  fog?.far ??1000 );
}

export function build(): THREE.Scene{

    const scene = new THREE.Scene();

    rebuildScene(scene);

    return scene
}

export function rebuild(scene: THREE.Scene, envParam?: EnvironmentParams): void{
    rebuildScene(scene, envParam?.fog)

    const oldGround = scene.children.find( obj => obj.name === "BUILDER_ground" )

    if(oldGround)
        scene.remove(oldGround)

    scene.add(buildGround( envParam?.ground, envParam?.grid ))

    const oldLights = scene.children.find( obj => obj.name === "BUILDER_lights" )

    if(oldLights)
        scene.remove(oldLights)

    if(envParam?.light?.useHemisphericColors) {
        scene.add(buildLights(envParam?.light, envParam?.ground, envParam?.fog))
    } else {
        scene.add(buildLights(envParam?.light))
    }
}