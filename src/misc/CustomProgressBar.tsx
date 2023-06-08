import {ProgressBar} from "react-bootstrap";
import React, {useEffect, useState} from "react";

interface Props{
    loadPercentage: number
    keepVisible?: number
}

const CustomProgressBar = (props: Props)=>{
    const[visible, setVisible] = useState<boolean>(true)

    useEffect(()=>{
        if(props.loadPercentage < 100 && !visible){
            setVisible(true)
        }

        if(props.loadPercentage === 100){
            setTimeout(()=>{
                if(props.loadPercentage === 100) setVisible(false)
            },props.keepVisible ?? 0)
        }
    },[props.loadPercentage])

    return <ProgressBar animated={false} now={props.loadPercentage} label={`${props.loadPercentage}%`}
                        style={{position:'absolute', zIndex:1, top:0, left:0, right:0, visibility: visible ? "visible" : "hidden" }} />;
}

export default CustomProgressBar