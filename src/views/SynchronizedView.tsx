import React, {useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import {ControlsOption} from "../builders/ControlsBuilder";
import * as IDAuthority from '../misc/IDAuthority'
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizedViewLogic from "../logic/SynchronizedViewLogic";
import {CameraOption} from "../builders/CameraBuilder";
import {EnvironmentParams} from "../builders/SceneBuilder";
import {Model} from "../misc/ModelLoader";
import {ProgressBar} from "react-bootstrap";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    model: Model
    controlsOption?: ControlsOption
    cameraOption?: CameraOption
    synchronizer?: Synchronizer
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
    environmentParams?: EnvironmentParams
}

const SynchronizedView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsOption.Orbit,
                       cursorOption = {style: CursorStyleOption.disabled},
                       cameraOption = CameraOption.perspective,
                       ...props
                   }: Props) => {

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [svl, setSvl] = useState<SynchronizedViewLogic>()
    const [loadPercentage, setLP] = useState<number>(0)

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

    // load model, when svl is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!svl)
            return;
        setLP(0)

        svl.loadModel(props.model, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })

        return ()=>{
            svl.removeLoaded()
        }
    },[svl, props.model.format, props.model.url, requestHeaders])

    return (
        <div style={style}>
            <ProgressBar now={loadPercentage} label={`${loadPercentage}%`} style={{position:'relative', zIndex:1, top:0, left:0, right:0}} />
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default SynchronizedView;