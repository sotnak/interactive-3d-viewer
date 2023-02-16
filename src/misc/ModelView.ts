import * as THREE from "three";
import * as RendererBuilder from "../builders/RendererBuilder";
import getParentElement from "./getParentElement";
import * as SceneBuilder from "../builders/SceneBuilder";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import * as ModelLoader from "./ModelLoader";
import * as SynchronizedTasks from "../synchronization/SynchronizedTasks";
import {SynchronizedAttributes, Synchronizer} from "../synchronization/Synchronizer";
import Cursor, {CursorOption, setCursorFromPointer} from "../cursors/Cursor";
import {LineCursor} from "../cursors/LineCursor";
import SphereCursor from "../cursors/SphereCursor";
import {buildCursor} from "../builders/SceneBuilder";


export default class ModelView{
    private readonly canvas: HTMLCanvasElement;
    private readonly id: number;
    private readonly synchronizer?: Synchronizer;
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

    private readonly animate = ()=>{
        requestAnimationFrame(this.animate)

        if(!this.scene || !this.camera)
            return;

        this.controls?.update();

        this.renderer?.render(this.scene, this.camera)
    }

    private readonly SyncFun = (attr: SynchronizedAttributes)=>{
        SynchronizedTasks.setCameraPosition(attr, this.camera)
        SynchronizedTasks.setCameraTarget(attr, this.controls)
        SynchronizedTasks.setCursor(attr, this.camera, this.cursor, this.loadedModel)
    }

    private readonly onPointerMove = ( event: { clientX: number; clientY: number; } ) => {

        const cursor = this.cursor?.getObject3D()
        if(!cursor)
            return;

        const pointer = new THREE.Vector2(0,0);

        const bounding = this.canvas.getBoundingClientRect()

        pointer.x = ( (event.clientX - bounding.left) / bounding.width ) * 2 - 1;
        pointer.y = - ( (event.clientY - bounding.top) / bounding.height ) * 2 + 1;

        setCursorFromPointer(pointer, this.camera, this.cursor, this.loadedModel)

        if(this.cursor?.constructor === LineCursor){
            this.synchronizer?.update(this.id, {cursor2D:{position: pointer, visible: cursor?.visible}})
        } else if(this.cursor?.constructor === SphereCursor) {
            this.synchronizer?.update(this.id, {cursor3D:{position: cursor.position, visible: cursor?.visible}})
        }

    }

    init(){
        console.log(this.id, "setup scene")

        this.renderer = RendererBuilder.build(this.canvas);
        this.scene = SceneBuilder.build();
        this.camera = SceneBuilder.buildCamera(this.parentElement.clientWidth, this.parentElement.clientHeight);
        this.controls = ControlsBuilder.build(this.canvas, this.camera)

        RendererBuilder.enableResizing(this.canvas, this.camera, this.renderer);

        this.canvas.addEventListener( 'pointermove', this.onPointerMove );

        this.animate()
    }

    useSynchronizer(synchronizer: Synchronizer){
        console.log(this.id, "use synchronizer")
        synchronizer.register(this.id, this.SyncFun)
    }

    removeSynchronizer(synchronizer: Synchronizer){
        console.log(this.id, "remove synchronizer")
        synchronizer.remove(this.id)
    }

    useCursor(option: CursorOption){
        if(!this.scene)
            return;

        console.log(this.id, "use cursor:", CursorOption[option])

        if(option === CursorOption.disabled){
            if(this.cursor){
                this.scene.remove(this.cursor.getObject3D());
                this.cursor = undefined;
            }
            return;
        }

        this.cursor = buildCursor(this.scene, option)
    }

    setControls(option: ControlsBuilder.ControlsOption){
        if(!this.camera)
            throw new Error('Unable to set controls. Camera is undefined.')

        console.log(this.id, "set controls:", ControlsBuilder.ControlsOption[option])

        const oldControls = this.controls
        this.controls = undefined
        oldControls?.dispose()

        this.controls = ControlsBuilder.build(this.canvas, this.camera, option)

        this.controls.addEventListener('change',()=>{
            this.synchronizer?.update(this.id, {cameraPosition: this.camera?.position, cameraTarget: this.controls?.target})
        })
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