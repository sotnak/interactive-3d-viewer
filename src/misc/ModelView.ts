import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "./getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "./ModelLoader";
import {SynchronizedAttributes, Synchronizer} from "./Synchronizer";


export default class ModelView{
    private readonly canvas: HTMLCanvasElement;
    private readonly id: number;
    private readonly synchronizer?: Synchronizer;
    private renderer?: THREE.WebGLRenderer;
    private parentElement: HTMLElement;
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private controls?: OrbitControls | TrackballControls;

    constructor(canvas: HTMLCanvasElement, id: number, synchronizer?: Synchronizer) {
        this.canvas = canvas
        this.parentElement = getParentElement(this.canvas)
        this.id = id
        this.synchronizer = synchronizer
    }

    readonly SyncFun = (attr: SynchronizedAttributes)=>{

        if(attr.cameraPosition)
            this.camera?.position.set(attr.cameraPosition.x, attr.cameraPosition.y, attr.cameraPosition.z)

        if(attr.cameraTarget)
            this.controls?.target.set(attr.cameraTarget.x, attr.cameraTarget.y, attr.cameraTarget.z)
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

        const oldControls = this.controls
        this.controls = undefined
        oldControls?.dispose()

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)
        this.controls.zoomSpeed = 1;

        this.controls.addEventListener('change',()=>{
            this.synchronizer?.update(this.id, {cameraPosition: this.camera?.position, cameraTarget: this.controls?.target})
        })
    }

    private animate = ()=>{
        requestAnimationFrame(this.animate)

        if(!this.scene || !this.camera)
            return;

        this.controls?.update();

        this.renderer?.render(this.scene, this.camera)
    }

    async load(url: string, requestHeaders: {[p: string]: string}, onProgress?: (event: ProgressEvent<EventTarget>) => void){

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        ModelLoader.removeLoaded(this.scene);
        await ModelLoader.loadGLTF(url, requestHeaders, this.scene, onProgress);
    }
}