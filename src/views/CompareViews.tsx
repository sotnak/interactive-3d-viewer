import React, {useState} from "react";
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizerImpl from "../synchronization/SynchronizerImpl";
import SynchronizedView from "./SynchronizedView";

interface Props{
    requestHeaders?: {[p: string]: string}
    urls: string[]
    styles?: React.CSSProperties[]
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
}

const CompareViews = ({
                          //styles = [{},{}],
                          ...props}: Props)=>{

    if(props.urls.length != 2)
        throw new Error('Exactly 2 urls must be provided.')

    if(props.styles && props.styles?.length != 2)
        throw new Error('Exactly 2 styles must be provided.')

    const[synchronizer] = useState<Synchronizer>(new SynchronizerImpl)

    return<div>
        {props.urls.map((url, index)=>
            <SynchronizedView key={index}
                       style={props.styles?.at(index)}
                       cursorOption={props.cursorOption}
                       url={url}
                       requestHeaders={props.requestHeaders}
                       synchronizer={synchronizer}
            />
        )}
    </div>
}

export default CompareViews