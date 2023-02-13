import React, {useEffect, useRef, useState} from "react";
import * as ControlsBuilder from './builders/ControlsBuilder'
import * as IDAuthority from './misc/IDAuthority'
import MV from "./misc/ModelView";
import {Synchronizer} from "./misc/Synchronizer";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    url: string,
    controlsOption?: ControlsBuilder.ControlsOption
    synchronizer?: Synchronizer
    cursorEnabled?: boolean
}

const ModelView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsBuilder.ControlsOption.Orbit,
                       cursorEnabled = false,
                       ...props
                    }: Props) => {

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [id] = useState<number>(IDAuthority.getId())
    const [mv, setMv] = useState<MV>()
    const [loadPercentage, setLP] = useState<number>(0)

    // setup scene, when canvas is ready
    useEffect(()=>{
        if(!canvasRef.current)
            return;

        const canvasAttr = canvasRef.current.getAttribute("data-engine")

        if(canvasAttr)
            return;

        console.log(id, "init")

        const n_mv = new MV(canvasRef.current, id, props.synchronizer)
        n_mv.init()

        setMv(n_mv)
    },[canvasRef.current])

    // setup / cleanup synchronization, when mv is ready and synchronizer is provided
    useEffect(()=>{
        if(!mv)
            return;

        if(props.synchronizer) {
            console.log(id, "register for synchronization")
            props.synchronizer?.register(id, mv.SyncFun)
        }

        //cleanup function
        return ()=>{
            if(props.synchronizer) {
                console.log(id, "synchronizer cleanup")
                props.synchronizer.remove(id)
            }
        }
    },[props.synchronizer, mv])

    useEffect(()=>{
        mv?.setCursorState(cursorEnabled)
    }, [cursorEnabled, mv])

    // set controls, when mv is ready / controlsOption changes
    useEffect(()=>{
        if(!mv)
            return;

        console.log(id, "set controls:", ControlsBuilder.ControlsOption[controlsOption])
        mv?.setControls(controlsOption)
    },[mv, controlsOption])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mv)
            return;

        console.log(id, "loading: ", props.url)
        setLP(0)

        mv.load(props.url, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })
    },[mv, props.url, requestHeaders])

    return (
        <div style={style}>
            <span style={{ top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView