import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import {ControlsOption} from "../builders/ControlsBuilder";
import * as IDAuthority from '../misc/IDAuthority'
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizedViewLogic from "../logic/SynchronizedViewLogic";
import {CameraOption} from "../builders/CameraBuilder";
import EnvironmentParams from "../misc/EnvironmentParams";
import {Model} from "../loading/ModelLoader";
import CustomModal from "../misc/CustomModal";
import ComponentRef from "../misc/ComponentRef";
import ControlsSensitivity from "../misc/ControlsSensitivity";
import {CameraPositions} from "../misc/PredefinedCamerasModule";
import FullscreenToggle from "../misc/FullscreenToggle";
import styleDefaults from "../misc/styleDefaults";
import CustomProgressBar from "../misc/CustomProgressBar";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    model: Model
    controlsOption?: ControlsOption
    cameraOption?: CameraOption
    synchronizer?: Synchronizer
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
    environmentParams?: EnvironmentParams
    sensitivity?: ControlsSensitivity
    setIsFS: React.Dispatch<React.SetStateAction<boolean>>
    isFullscreen: boolean
    divRef: React.RefObject<HTMLDivElement>
}

const SynchronizedView = React.forwardRef<ComponentRef, Props>(({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsOption.Orbit,
                       cursorOption = {style: CursorStyleOption.disabled},
                       cameraOption = CameraOption.perspective,
                       ...props
                   }: Props, ref: React.Ref<ComponentRef>) => {

    style = styleDefaults(style)

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [svl, setSvl] = useState<SynchronizedViewLogic>()
    const [loadPercentage, setLP] = useState<number>(0)

    const [errorMessage, setEM] = useState<string | undefined>(undefined)

    // setup scene, when canvas is ready
    useEffect(()=>{
        if(!canvasRef.current)
            return;

        const canvasAttr = canvasRef.current.getAttribute("data-engine")

        if(canvasAttr)
            return;

        const id = IDAuthority.getId()

        canvasRef.current.setAttribute('id', id.toString())

        const n_svl = new SynchronizedViewLogic(canvasRef.current, id, props.synchronizer)
        n_svl.init()

        setSvl(n_svl)
    },[canvasRef.current])

    // setup / cleanup synchronization, when svl is ready and synchronizer is provided
    useEffect(()=>{
        if(!svl)
            return;

        if(props.synchronizer) {
            svl.useSynchronizer(props.synchronizer)
        }

        //cleanup function
        return ()=>{
            if(props.synchronizer) {
                svl.removeSynchronizer(props.synchronizer)
            }
        }
    },[props.synchronizer, svl])

    // set cursor, when svl is ready / cursor style or cursor event changes
    useEffect(()=>{
        if(!svl)
            return;
        svl.useCursor(cursorOption.style, cursorOption.event)
    }, [cursorOption?.style, cursorOption?.event, svl])

    // set background and ground color, when mvl is ready / environmentParams changes
    useEffect(()=>{
        svl?.setEnvironment( props.environmentParams )
    }, [svl, props.environmentParams])

    // set controls, when svl is ready / controlsOption changes
    useEffect(()=>{
        if(!svl)
            return;

        svl?.setControls(controlsOption)
    },[svl, controlsOption])

    // set camera, when mvl is ready / cameraOption changes
    useEffect(()=>{
        svl?.setCamera(cameraOption, controlsOption)
    }, [svl, cameraOption])

    // set controls sensitivity, when svl is ready / sensitivity changes
    useEffect(()=>{
        svl?.setSensitivity(props.sensitivity)
    }, [svl, props.sensitivity])

    // load model, when svl is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!svl)
            return;
        setLP(0)

        svl.loadModel(props.model, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            setLP( (progress.loaded/progress.total) * 100 )
        }).then(()=>{
            setLP(100)
        }).catch((e)=>{
            setEM(e.message)
            throw e;
        })

        return ()=>{
            svl.removeLoaded()
        }
    },[svl, props.model.format, props.model.url, requestHeaders]);

    useImperativeHandle(ref, ()=>({
        resetCamera(): void{
            svl?.resetCamera()
        },
        moveCamera(position: CameraPositions): void{
            svl?.setCameraPosition(position)
        }
    }), [svl]);

    return (
        <div style={style}>
            <CustomProgressBar loadPercentage={loadPercentage} keepVisible={3000}/>
            <canvas ref={canvasRef}/>
            <FullscreenToggle isFullscreen={props.isFullscreen} setIsFS={props.setIsFS} divRef={props.divRef}/>

            {errorMessage ? <CustomModal messsage={errorMessage} handleClose={ ()=>{setEM(undefined)} }/> : null}
        </div>
    );
})

export default SynchronizedView;