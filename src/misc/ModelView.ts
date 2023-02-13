import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "./getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "./ModelLoader";
import * as CursorHandler from "./CursorHandler";
import * as SynchronizedTasks from "./SynchronizedTasks"
import {SynchronizedAttributes, Synchronizer} from "./Synchronizer";


export default class ModelView{
    private readonly canvas: HTMLCanvasElement;
    private readonly id: number;
    private readonly synchronizer?: Synchronizer;
    private readonly raycaster = new THREE.Raycaster();
    private renderer?: THREE.WebGLRenderer;
    private parentElement: HTMLElement;
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private controls?: OrbitControls | TrackballControls;
    private loadedModel?: THREE.Group;
    private line?: THREE.Line<any, THREE.LineBasicMaterial>;

    constructor(canvas: HTMLCanvasElement, id: number, synchronizer?: Synchronizer) {
        this.canvas = canvas
        this.parentElement = getParentElement(this.canvas)
        this.id = id
        this.synchronizer = synchronizer
    }

    readonly SyncFun = (attr: SynchronizedAttributes)=>{
        SynchronizedTasks.setCameraPosition(attr, this.camera)
        SynchronizedTasks.setCameraTarget(attr, this.controls)
        //SynchronizedTasks.setCursorPosition(attr, this.raycaster, this.camera, this.line)

        if(attr.cursorPosition)
            CursorHandler.setCursor(attr.cursorPosition, this.raycaster, this.camera, this.line, this.loadedModel)
    }

    readonly onPointerMove = ( event: { clientX: number; clientY: number; } ) => {

        const pointer = new THREE.Vector2(0,0);

        const bounding = this.canvas.getBoundingClientRect()

        pointer.x = ( (event.clientX - bounding.left) / bounding.width ) * 2 - 1;
        pointer.y = - ( (event.clientY + bounding.top) / bounding.height ) * 2 + 1;

        CursorHandler.setCursor(pointer, this.raycaster, this.camera, this.line, this.loadedModel)

        this.synchronizer?.update(this.id, {cursorPosition: pointer})
    }

    init(){
        this.renderer = RendererBuilder.build(this.canvas);
        this.scene = SceneBuilder.build();
        this.camera = SceneBuilder.buildCamera(this.parentElement.clientWidth, this.parentElement.clientHeight);
        this.controls = ControlsBuilder.build(this.canvas, this.camera)

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

        this.line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0x00ff00}) );
        this.line.visible = false;
        this.scene.add( this.line );

        RendererBuilder.enableResizing(this.canvas, this.camera, this.renderer);

        this.canvas.addEventListener( 'pointermove', this.onPointerMove );

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
        this.loadedModel = await ModelLoader.loadGLTF(url, requestHeaders, this.scene, onProgress);
    }
}