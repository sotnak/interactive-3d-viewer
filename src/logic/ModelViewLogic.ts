import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "../misc/getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "../misc/ModelLoader";


export default class ModelViewLogic {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly id: number;
    protected renderer?: THREE.WebGLRenderer;
    protected parentElement: HTMLElement;
    protected scene?: THREE.Scene;
    protected camera?: THREE.PerspectiveCamera;
    protected controls?: OrbitControls | TrackballControls;
    protected loadedModel?: THREE.Group;

    constructor(canvas: HTMLCanvasElement, id: number) {
        this.canvas = canvas
        this.parentElement = getParentElement(this.canvas)
        this.id = id
    }

    private readonly animate = ()=>{
        requestAnimationFrame(this.animate)

        if(!this.scene || !this.camera)
            return;

        this.controls?.update();

        this.renderer?.render(this.scene, this.camera)
    }

    init(){
        console.log(this.id, "setup scene")

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

        console.log(this.id, "set controls:", ControlsBuilder.ControlsOption[option])

        const oldControls = this.controls
        this.controls = undefined
        oldControls?.dispose()

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)
    }

    async load(url: string, requestHeaders: {[p: string]: string}, onProgress?: (event: ProgressEvent<EventTarget>) => void): Promise<THREE.Group> {
        this.loadedModel = undefined

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        console.log(this.id, "loading model:", url)

        ModelLoader.removeLoaded(this.scene);
        this.loadedModel = await ModelLoader.loadGLTF(url, requestHeaders, this.scene, onProgress);

        return this.loadedModel;
    }
}