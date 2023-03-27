import React, {useEffect, useRef, useState} from "react";
import {ControlsOption} from "../builders/ControlsBuilder";
import * as IDAuthority from '../misc/IDAuthority'
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizedViewLogic from "../logic/SynchronizedViewLogic";
import {CameraOption} from "../builders/CameraBuilder";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    url: string,
    controlsOption?: ControlsOption
    cameraOption?: CameraOption
    synchronizer?: Synchronizer
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
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

    // setup / cleanup synchronization, when mv is ready and synchronizer is provided
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

    useEffect(()=>{
        if(!svl)
            return;
        svl.useCursor(cursorOption.style, cursorOption.event)
    }, [cursorOption?.style, cursorOption?.event, svl])

    // set controls, when mv is ready / controlsOption changes
    useEffect(()=>{
        if(!svl)
            return;

        svl?.setControls(controlsOption)
    },[svl, controlsOption])

    useEffect(()=>{
        svl?.setCamera(cameraOption, controlsOption)
    }, [svl, cameraOption])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!svl)
            return;
        setLP(0)

        svl.load(props.url, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })
    },[svl, props.url, requestHeaders])

    return (
        <div style={style}>
            <span style={{ top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default SynchronizedView;