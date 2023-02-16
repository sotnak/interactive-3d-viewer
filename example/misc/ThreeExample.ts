import * as THREE from 'three';

import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {WebGLRenderer} from "three";

let camera: THREE.PerspectiveCamera, controls: TrackballControls, canvas: HTMLCanvasElement, parent: HTMLElement

let scene: THREE.Scene, renderer: WebGLRenderer

let sphere: THREE.Mesh, plane: THREE.Mesh;

const start = Date.now();

export function init(c: HTMLCanvasElement) {

    canvas = c
    parent = canvas.parentElement ?? document.createElement('div')

    camera = new THREE.PerspectiveCamera( 70, parent.clientWidth / parent.clientHeight, 1, 10000 );
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0, 0, 0 );

    const pointLight1 = new THREE.PointLight( 0xffffff );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );

    const pointLight2 = new THREE.PointLight( 0xffffff, 0.25 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );

    sphere = new THREE.Mesh( new THREE.SphereGeometry( 200, 20, 10 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );
    scene.add( sphere );

    // Plane

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
    plane.position.y = - 200;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize( parent.clientWidth, parent.clientHeight );

    controls = new TrackballControls( camera, canvas );

    //
    new ResizeObserver(onWindowResize).observe(parent)

}

function onWindowResize() {

    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( parent.clientWidth, parent.clientHeight );

}

//

export function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const timer = Date.now() - start;

    sphere.position.y = Math.abs( Math.sin( timer * 0.002 ) ) * 150;
    sphere.rotation.x = timer * 0.0003;
    sphere.rotation.z = timer * 0.0002;

    controls.update();

    renderer.render(scene, camera)

}