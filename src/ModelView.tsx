import React, {useEffect, useRef, useState} from "react";
import {ControlsOption} from "./builders/ControlsBuilder";
import * as IDAuthority from './misc/IDAuthority'
import MV from "./misc/ModelView";
import Synchronizer from "./synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "./cursors/CursorOptions";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    url: string,
    controlsOption?: ControlsOption
    synchronizer?: Synchronizer
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
}

const ModelView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsOption.Orbit,
                       cursorOption = {style: CursorStyleOption.disabled},
                       ...props
                    }: Props) => {

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mv, setMv] = useState<MV>()
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

        const n_mv = new MV(canvasRef.current, id, props.synchronizer)
        n_mv.init()

        setMv(n_mv)
    },[canvasRef.current])

    // setup / cleanup synchronization, when mv is ready and synchronizer is provided
    useEffect(()=>{
        if(!mv)
            return;

        if(props.synchronizer) {
            mv.useSynchronizer(props.synchronizer)
        }

        //cleanup function
        return ()=>{
            if(props.synchronizer) {
                mv.removeSynchronizer(props.synchronizer)
            }
        }
    },[props.synchronizer, mv])

    useEffect(()=>{
        if(!mv)
            return;
        mv.useCursor(cursorOption.style, cursorOption.event)
    }, [cursorOption, mv])

    // set controls, when mv is ready / controlsOption changes
    useEffect(()=>{
        if(!mv)
            return;

        mv?.setControls(controlsOption)
    },[mv, controlsOption])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mv)
            return;
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