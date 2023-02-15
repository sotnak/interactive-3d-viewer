import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "./getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "./ModelLoader";
import * as SynchronizedTasks from "../synchronization/SynchronizedTasks"
import {SynchronizedAttributes, Synchronizer} from "../synchronization/Synchronizer";
import Cursor, {setCursor} from "../cursors/Cursor";


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
    private cursor?: Cursor;

    constructor(canvas: HTMLCanvasElement, id: number, synchronizer?: Synchronizer) {
        this.canvas = canvas
        this.parentElement = getParentElement(this.canvas)
        this.id = id
        this.synchronizer = synchronizer
    }

    private readonly SyncFun = (attr: SynchronizedAttributes)=>{
        SynchronizedTasks.setCameraPosition(attr, this.camera)
        SynchronizedTasks.setCameraTarget(attr, this.controls)
        SynchronizedTasks.setCursorPosition(attr, this.raycaster, this.camera, this.cursor, this.loadedModel)
    }

    readonly onPointerMove = ( event: { clientX: number; clientY: number; } ) => {

        const pointer = new THREE.Vector2(0,0);

        const bounding = this.canvas.getBoundingClientRect()

        pointer.x = ( (event.clientX - bounding.left) / bounding.width ) * 2 - 1;
        pointer.y = - ( (event.clientY - bounding.top) / bounding.height ) * 2 + 1;

        setCursor(pointer, this.raycaster, this.camera, this.cursor, this.loadedModel)

        this.synchronizer?.update(this.id, {cursorPosition: pointer})
    }

    init(){
        this.renderer = RendererBuilder.build(this.canvas);
        this.scene = SceneBuilder.build();
        this.camera = SceneBuilder.buildCamera(this.parentElement.clientWidth, this.parentElement.clientHeight);
        this.controls = ControlsBuilder.build(this.canvas, this.camera)

        this.cursor = SceneBuilder.buildCursor(this.scene)

        RendererBuilder.enableResizing(this.canvas, this.camera, this.renderer);

        this.animate()
        console.log(this.id, "setup scene")
    }

    useSynchronizer(synchronizer: Synchronizer){
        synchronizer.register(this.id, this.SyncFun)
        console.log(this.id, "use synchronizer")
    }

    removeSynchronizer(synchronizer: Synchronizer){
        synchronizer.remove(this.id)
        console.log(this.id, "remove synchronizer")
    }

    setCursorState(enabled: boolean){
        if(enabled){
            this.canvas.addEventListener( 'pointermove', this.onPointerMove );
        }else{
            this.canvas.removeEventListener( 'pointermove', this.onPointerMove );
            if(this.cursor)
                this.cursor.hideCursor()
        }
        console.log(this.id, "set cursor:", enabled)
    }

    setControls(option: ControlsBuilder.ControlsOption){
        if(!this.camera)
            throw new Error('Unable to set controls. Camera is undefined.')

        const oldControls = this.controls
        this.controls = undefined
        oldControls?.dispose()

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)

        this.controls.addEventListener('change',()=>{
            this.synchronizer?.update(this.id, {cameraPosition: this.camera?.position, cameraTarget: this.controls?.target})
        })
        console.log(this.id, "set controls:", ControlsBuilder.ControlsOption[option])
    }

    private animate = ()=>{
        requestAnimationFrame(this.animate)

        if(!this.scene || !this.camera)
            return;

        this.controls?.update();

        this.renderer?.render(this.scene, this.camera)
    }

    async load(url: string, requestHeaders: {[p: string]: string}, onProgress?: (event: ProgressEvent<EventTarget>) => void): Promise<THREE.Group> {
        this.loadedModel = undefined

        if(!this.scene)
            throw new Error('Unable to load. Scene is undefined.')

        ModelLoader.removeLoaded(this.scene);
        this.loadedModel = await ModelLoader.loadGLTF(url, requestHeaders, this.scene, onProgress);
        console.log(this.id, "loaded model:", url)
        return this.loadedModel;
    }
}