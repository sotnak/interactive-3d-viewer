import React, {useEffect, useRef} from "react";
import {init, animate} from './misc/ThreeExample'

interface Props {
    style: React.CSSProperties
}

const ThreeExample = ({style = {} /*,...props*/}: Props)=>{
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if(canvasRef.current){
            init(canvasRef.current)
            animate()
        }
    },[canvasRef.current])

    return (
        <div style={style}>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ThreeExample