import ModelView from "./ModelView";
import React, {useState} from "react";
import {Synchronizer} from "./misc/Synchronizer";

interface Props{
    requestHeaders?: {[p: string]: string}
    urls: string[]
}

const ModelCompare = (props: Props)=>{

    if(props.urls.length != 2)
        throw new Error('Exactly 2 urls must be provided.')

    const[synchronizer] = useState<Synchronizer>(new Synchronizer)

    return<div>
        <ModelView style={{position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'}}
                   url={props.urls[0]}
                   requestHeaders={props.requestHeaders}
                   synchronizer={synchronizer}
        />
        <ModelView style={{position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}}
                   url={props.urls[1]}
                   requestHeaders={props.requestHeaders}
                   synchronizer={synchronizer}
        />
    </div>
}

export default ModelCompare