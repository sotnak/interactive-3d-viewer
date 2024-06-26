import React, {useImperativeHandle, useRef, useState} from "react";
import Synchronizer from "../synchronization/Synchronizer";
import {CursorEventOption, CursorStyleOption} from "../cursors/CursorOptions";
import SynchronizerImpl from "../synchronization/SynchronizerImpl";
import SynchronizedView from "./SynchronizedView";
import {CameraOption} from "../builders/CameraBuilder";
import EnvironmentParams from "../misc/EnvironmentParams";
import {Model} from "../loading/ModelLoader";
import ComponentRef from "../misc/ComponentRef";
import ControlsSensitivity from "../misc/ControlsSensitivity";
import {CameraPositions} from "../misc/PredefinedCamerasModule";

interface Props{
    requestHeaders?: {[p: string]: string}
    models: Model[]
    styles?: React.CSSProperties[]
    cameraOption?: CameraOption
    cursorOption?: {style: CursorStyleOption; event?: CursorEventOption}
    environmentParams?: EnvironmentParams
    sensitivity?: ControlsSensitivity
}

const fullscreenStyles: React.CSSProperties[] = [
    {float:"left", height:"100vh", width:"50vw", borderRight: "1px solid"},
    {float:"left", height:"100vh", width:"50vw", borderLeft: "1px solid"}
]

const CompareViews = React.forwardRef<ComponentRef, Props>(({
                          cameraOption = CameraOption.perspective,
                          //styles = [{},{}],
                          ...props}: Props, ref: React.Ref<ComponentRef>)=>{

    if(props.models.length != 2)
        throw new Error('Exactly 2 models must be provided.')

    if(props.styles && props.styles?.length != 2)
        throw new Error('Exactly 2 styles must be provided.')

    const[synchronizer] = useState<Synchronizer>(new SynchronizerImpl)

    const refs :  React.RefObject<ComponentRef>[] = [useRef<ComponentRef>(null), useRef<ComponentRef>(null)]
    const divRef = useRef<HTMLDivElement>(null)

    const [isFullscreen, setIsFS] = useState<boolean>(false)

    useImperativeHandle(ref, (): ComponentRef =>({
        resetCamera(): void{
            refs[0].current?.resetCamera()
            refs[1].current?.resetCamera();
        },
        moveCamera(position: CameraPositions): void{
            refs[0].current?.moveCamera(position)
            refs[1].current?.moveCamera(position)
        }
    }), [refs[0].current, refs[1].current]);

    return<div ref={divRef}>
        {props.models.map((model, index)=>
            <SynchronizedView key={index}
                              style={isFullscreen ? fullscreenStyles[index] : props.styles?.at(index)}
                              cursorOption={props.cursorOption}
                              cameraOption={cameraOption}
                              model={model}
                              requestHeaders={props.requestHeaders}
                              synchronizer={synchronizer}
                              environmentParams={props.environmentParams}
                              sensitivity={props.sensitivity}
                              ref={refs[index]}
                              isFullscreen={isFullscreen}
                              setIsFS={setIsFS}
                              divRef={divRef}
            />
        )}
    </div>
})

export default CompareViews