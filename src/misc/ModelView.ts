import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "./getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "./ModelLoader";


export default class ModelView{
    private readonly canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer | undefined;
    private parentElement: HTMLElement;
    private scene: THREE.Scene | undefined;
    private camera: THREE.PerspectiveCamera | undefined;
    private controls: OrbitControls | TrackballControls | undefined;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.parentElement = getParentElement(this.canvas)
    }
    init(){
        this.renderer = RendererBuilder.build(this.canvas);
        this.scene = SceneBuilder.build();
        this.camera = SceneBuilder.buildCamera(this.parentElement.clientWidth, this.parentElement.clientHeight);
        this.controls = ControlsBuilder.build(this.canvas, this.camera)

        RendererBuilder.enableResizing(this.canvas, this.camera, this.renderer);

        this.animate()
    }

    setControls(option: ControlsBuilder.ControlsOption){
        if(!this.camera)
            throw new Error('Unable to set controls. Camera is undefined.')

        this.controls?.dispose()

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)
    }

    private animate = ()=>{
        requestAnimationFrame(this.animate)

        if(!this.controls || !this.renderer || !this.scene || !this.camera)
            return;

        this.controls.update();

        this.renderer.render(this.scene, this.camera)
    }

    async load(url: string, requestHeaders: {[p: string]: string}){

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        ModelLoader.removeLoaded(this.scene);
        await ModelLoader.loadGLTF(url, requestHeaders, this.scene);
    }
}