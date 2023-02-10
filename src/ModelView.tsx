import React, {useEffect, useRef, useState} from "react";
import * as ControlsBuilder from './builders/ControlsBuilder'
import MV from "./misc/ModelView";

interface Props {
    style: React.CSSProperties,
    requestHeaders: {[p: string]: string},
    url: string,
    controlsOption: ControlsBuilder.ControlsOption
}

const ModelView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsBuilder.ControlsOption.Orbit,
                       ...props
                    }: Props) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mv, setMv] = useState<MV>()
    const [loadPercentage, setLP] = useState<number>(0)

    useEffect(()=>{
        if(!canvasRef.current)
            return;

        const canvasAttr = canvasRef.current.getAttribute("data-engine")

        if(canvasAttr)
            return;

        console.log("init")

        const n_mv = new MV(canvasRef.current)
        n_mv.init()

        setMv(n_mv)
    },[canvasRef.current])

    useEffect(()=>{
        if(!mv)
            return;

        console.log("set controls:", ControlsBuilder.ControlsOption[controlsOption])
        mv?.setControls(controlsOption)
    },[mv, controlsOption])

    useEffect(()=>{
        if(!mv)
            return;

        console.log("loading: ", props.url)

        mv?.load(props.url, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })
    },[mv, props.url, requestHeaders])

    return (
        <div style={style}>
            <span style={{position: 'absolute', top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView