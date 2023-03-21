import ModelViewLogic from "./ModelViewLogic";
import Synchronizer, {SynchronizedAttributes} from "../synchronization/Synchronizer";
import * as SynchronizedTasks from "../synchronization/SynchronizedTasks";
import * as ControlsBuilder from "../builders/ControlsBuilder";
import * as THREE from "three";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import {setCursorFromPointer} from "../cursors/CursorHelpers";
import * as CursorBuilder from "../builders/CursorBuilder";
import {Cursor, CursorType} from "../cursors/Cursor";


export default class SynchronizedViewLogic extends ModelViewLogic{

    protected readonly synchronizer?: Synchronizer;
    protected cursor?: Cursor;
    protected cursorEvent: CursorEventOption = CursorEventOption.pointerdown

    constructor(canvas: HTMLCanvasElement, id: number, synchronizer?: Synchronizer) {
        super(canvas, id)
        this.synchronizer = synchronizer
    }

    private readonly SyncFun = (msg: SynchronizedAttributes)=>{
        SynchronizedTasks.setCameraPosition(msg, this.camera)
        SynchronizedTasks.setCameraTarget(msg, this.controls)
        SynchronizedTasks.setCursorPosition(msg, this.camera, this.cursor, this.loadedModel)
    }

    protected readonly onPointerEvent = ( event: { clientX: number; clientY: number; } ) => {
        const cursorObject = this.cursor?.getObject3D()

        if(!cursorObject)
            return;

        const pointer = new THREE.Vector2(0,0);

        const bounding = this.canvas.getBoundingClientRect()

        pointer.x = ( (event.clientX - bounding.left) / bounding.width ) * 2 - 1;
        pointer.y = - ( (event.clientY - bounding.top) / bounding.height ) * 2 + 1;

        const hideOnMiss = this.cursorEvent === CursorEventOption.pointermove

        const intersection = setCursorFromPointer(pointer, this.camera, this.cursor, this.loadedModel, hideOnMiss)

        // if hide on miss disabled and missed don't synchronize (issue with synchronizing 2D cursor on camera move)
        if(!hideOnMiss && !intersection.point)
            return;

        if(this.cursor?.type === CursorType.cursor2D){
            this.synchronizer?.update(this.id, {cursor2D:{position: pointer, visible: cursorObject.visible}})
        } else if(this.cursor?.type === CursorType.cursor3D) {
            this.synchronizer?.update(this.id, {cursor3D:{position: cursorObject.position, visible: cursorObject.visible}})
        }

    }

    init() {
        super.init();
        this.canvas.addEventListener( this.cursorEvent, this.onPointerEvent );
    }

    useSynchronizer(synchronizer: Synchronizer){
        console.log(this.id, "use synchronizer")
        synchronizer.register(this.id, this.SyncFun)
    }

    removeSynchronizer(synchronizer: Synchronizer){
        console.log(this.id, "remove synchronizer")
        synchronizer.remove(this.id)
    }

    setControls(option: ControlsBuilder.ControlsOption){
        super.setControls(option)

        this.controls?.addEventListener('change',()=>{
            this.synchronizer?.update(this.id, {cameraPosition: this.camera?.position, cameraTarget: this.controls?.target})
        })
    }

    useCursor(style: CursorStyleOption, event?: CursorEventOption){
        if(!this.scene)
            return;

        if(event){
            console.log(this.id, "use cursor event:", CursorEventOption[event])
            this.canvas.removeEventListener(this.cursorEvent, this.onPointerEvent);
            this.cursorEvent = event
            this.canvas.addEventListener( this.cursorEvent, this.onPointerEvent );
        }

        console.log(this.id, "use cursor style:", CursorStyleOption[style])

        if(this.cursor)
            this.scene.remove(this.cursor.getObject3D());

        if(style === CursorStyleOption.disabled){
            if(this.cursor)
                this.cursor = undefined;

            return;
        }

        this.cursor = CursorBuilder.build(this.scene, style)
    }
}