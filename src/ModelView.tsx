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

    useEffect(()=>{
        if(canvasRef.current)
            setMv(new MV(canvasRef.current))
    },[canvasRef.current])

    useEffect(()=>{
        mv?.init()
    },[mv])

    useEffect(()=>{
        mv?.setControls(controlsOption)
    })

    useEffect(()=>{
        mv?.load(props.url, requestHeaders)
    },[mv, props.url, requestHeaders])

    return (
        <div style={style}>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView