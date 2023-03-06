import React, {useEffect, useRef, useState} from "react";
import {ControlsOption} from "./builders/ControlsBuilder";
import * as IDAuthority from './misc/IDAuthority'
import ModelViewLogic from "./misc/ModelViewLogic";
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

    const [mvl, setMvl] = useState<ModelViewLogic>()
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

        const n_mvl = new ModelViewLogic(canvasRef.current, id, props.synchronizer)
        n_mvl.init()

        setMvl(n_mvl)
    },[canvasRef.current])

    // setup / cleanup synchronization, when mv is ready and synchronizer is provided
    useEffect(()=>{
        if(!mvl)
            return;

        if(props.synchronizer) {
            mvl.useSynchronizer(props.synchronizer)
        }

        //cleanup function
        return ()=>{
            if(props.synchronizer) {
                mvl.removeSynchronizer(props.synchronizer)
            }
        }
    },[props.synchronizer, mvl])

    useEffect(()=>{
        if(!mvl)
            return;
        mvl.useCursor(cursorOption.style, cursorOption.event)
    }, [cursorOption, mvl])

    // set controls, when mv is ready / controlsOption changes
    useEffect(()=>{
        if(!mvl)
            return;

        mvl?.setControls(controlsOption)
    },[mvl, controlsOption])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mvl)
            return;
        setLP(0)

        mvl.load(props.url, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })
    },[mvl, props.url, requestHeaders])

    return (
        <div style={style}>
            <span style={{ top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView