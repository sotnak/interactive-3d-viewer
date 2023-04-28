import React, {useState} from "react";
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizerImpl from "../synchronization/SynchronizerImpl";
import SynchronizedView from "./SynchronizedView";
import {CameraOption} from "../builders/CameraBuilder";
import {EnvironmentParams} from "../builders/SceneBuilder";
import {Model} from "../loading/ModelLoader";

interface Props{
    requestHeaders?: {[p: string]: string}
    models: Model[]
    styles?: React.CSSProperties[]
    cameraOption?: CameraOption
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
    environmentParams?: EnvironmentParams
}

const CompareViews = ({
                          cameraOption = CameraOption.perspective,
                          //styles = [{},{}],
                          ...props}: Props)=>{

    if(props.models.length != 2)
        throw new Error('Exactly 2 models must be provided.')

    if(props.styles && props.styles?.length != 2)
        throw new Error('Exactly 2 styles must be provided.')

    const[synchronizer] = useState<Synchronizer>(new SynchronizerImpl)

    return<div>
        {props.models.map((model, index)=>
            <SynchronizedView key={index}
                              style={props.styles?.at(index)}
                              cursorOption={props.cursorOption}
                              cameraOption={cameraOption}
                              model={model}
                              requestHeaders={props.requestHeaders}
                              synchronizer={synchronizer}
                              environmentParams={props.environmentParams}
            />
        )}
    </div>
}

export default CompareViews