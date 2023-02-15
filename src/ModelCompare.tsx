import ModelView from "./ModelView";
import React, {useState} from "react";
import {Synchronizer} from "./synchronization/Synchronizer";

interface Props{
    requestHeaders?: {[p: string]: string}
    urls: string[]
    styles?: React.CSSProperties[]
    cursorEnabled?: boolean
}

const ModelCompare = ({
                          //styles = [{},{}],
                          ...props}: Props)=>{

    if(props.urls.length != 2)
        throw new Error('Exactly 2 urls must be provided.')

    if(props.styles && props.styles?.length != 2)
        throw new Error('Exactly 2 styles must be provided.')

    const[synchronizer] = useState<Synchronizer>(new Synchronizer)

    return<div>
        {props.urls.map((url, index)=>
            <ModelView key={index}
                       style={props.styles?.at(index)}
                       cursorEnabled={props.cursorEnabled}
                       url={url}
                       requestHeaders={props.requestHeaders}
                       synchronizer={synchronizer}
            />
        )}
    </div>
}

export default ModelCompare