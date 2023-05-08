import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "../misc/getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import EnvironmentParams from "../misc/EnvironmentParams";
import * as CameraBuilder from "../builders/CameraBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {Controls, ControlsOption} from "../builders/ControlsBuilder";
import * as ModelLoader from "../loading/ModelLoader";
import {Model, ModelFormat} from "../loading/ModelLoader";
import {getResizeObserver} from "../misc/CanvasResizeObserver";
import {LoadingCallbacksHandler} from "../loading/LoadingCallbacksHandler";
import {CameraOption} from "../builders/CameraBuilder";
import ControlsSensitivity from "../misc/ControlsSensitivity";


export default class ModelViewLogic {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly id: number;
    protected renderer?: THREE.WebGLRenderer;
    protected parentElement: HTMLElement;
    protected scene?: THREE.Scene;
    protected camera?: THREE.Camera;
    protected controls?: Controls;
    protected loadedModel?: THREE.Group;
    protected resizeObserver?: ResizeObserver;
    protected sensitivity: ControlsSensitivity | undefined;

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

    setEnvironment(envParams?: EnvironmentParams){
        if(this.scene)
            SceneBuilder.rebuild(this.scene, envParams)
    }
    setControls(option: ControlsOption){
        if(!this.camera)
            return

        console.log(this.id, "set controls:", ControlsOption[option])

        if(this.controls){
            const oldControls = this.controls
            this.controls = undefined

            oldControls.reset()
            oldControls?.dispose()
        }

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)
        this.setSensitivity(this.sensitivity)
    }

    setSensitivity(sensitivity?: ControlsSensitivity){
        //console.log(this.id, "set sensitivity:", sensitivity)

        this.sensitivity = sensitivity
        if(this.controls) {
            this.controls.panSpeed = sensitivity?.pan ?? 1
            this.controls.rotateSpeed = sensitivity?.rotate ?? 1
            this.controls.zoomSpeed = sensitivity?.zoom ?? 1
        }
    }

    setCamera(cameraOption: CameraOption, controlsOption: ControlsOption){

        console.log(this.id, "set camera:", CameraOption[cameraOption])

        this.resizeObserver?.disconnect()

        this.camera=CameraBuilder.build(cameraOption)
        this.setControls(controlsOption)

        this.resizeObserver = getResizeObserver(this.canvas, this.camera, this.renderer);
        this.resizeObserver.observe(getParentElement(this.canvas))
    }

    resetCamera(){
        console.log(this.id, "reset camera")

        this.controls?.reset()
    }

    async load(url: string, requestHeaders: {[p: string]: string}, onProgress?: (event: ProgressEvent<EventTarget>) => void): Promise<THREE.Group> {
        this.loadedModel = undefined

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        console.log(this.id, "loading model:", url)

        const lch = new LoadingCallbacksHandler()

        this.loadedModel = await ModelLoader.load(ModelFormat.gltf, url, requestHeaders, this.scene, lch.participate(onProgress) );

        return this.loadedModel;
    }

    async loadModel(model: Model, requestHeaders: {[p: string]: string}, onProgress?: (event: ProgressEvent<EventTarget>) => void): Promise<THREE.Group> {
        this.loadedModel = undefined

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        console.log(this.id, "loading model:", model.url, ModelFormat[model.format])

        this.loadedModel = await ModelLoader.load(model.format, model.url, requestHeaders, this.scene, onProgress);

        console.log(this.id, "model loaded")

        return this.loadedModel;
    }

    removeLoaded(){
        if(this.scene) {
            ModelLoader.removeLoaded(this.scene);
            this.loadedModel = undefined;
        }
    }
}