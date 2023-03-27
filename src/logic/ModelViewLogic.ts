import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "../misc/getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as CameraBuilder from "../builders/CameraBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {ControlsOption} from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "../misc/ModelLoader";
import {getResizeObserver} from "../misc/CanvasResizeObserver";


export default class ModelViewLogic {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly id: number;
    protected renderer?: THREE.WebGLRenderer;
    protected parentElement: HTMLElement;
    protected scene?: THREE.Scene;
    protected camera?: THREE.Camera;
    protected controls?: OrbitControls | TrackballControls;
    protected loadedModel?: THREE.Group;
    protected resizeObserver?: ResizeObserver;

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

        this.animate()
    }

    setControls(option: ControlsBuilder.ControlsOption){
        if(!this.camera)
            return

        console.log(this.id, "set controls:", ControlsBuilder.ControlsOption[option])

        if(this.controls){
            const oldControls = this.controls
            this.controls = undefined

            oldControls.reset()
            oldControls?.dispose()
        }

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)
    }

    setCamera(cameraOption: CameraBuilder.CameraOption, controlsOption: ControlsOption){

        console.log(this.id, "set camera:", CameraBuilder.CameraOption[cameraOption])

        this.resizeObserver?.disconnect()

        this.camera=CameraBuilder.build(cameraOption)
        this.setControls(controlsOption)

        this.resizeObserver = getResizeObserver(this.canvas, this.camera, this.renderer);
        this.resizeObserver.observe(getParentElement(this.canvas))
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