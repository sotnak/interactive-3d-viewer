import React, {useEffect, useRef, useState} from "react";
import {ControlsOption} from "../builders/ControlsBuilder";
import {CameraOption} from "../builders/CameraBuilder";
import * as IDAuthority from "../misc/IDAuthority";
import ModelCompareLogic from "../logic/ModelCompareLogic";
import {SelectorOption} from "../builders/SelectorBuilder";


interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    urls: string[],
    controlsOption?: ControlsOption,
    cameraOption?: CameraOption
    selectorOption?: SelectorOption
    activeModelIndex?: number
}

const ModelCompare = ({
                          style = {},
                          requestHeaders = {},
                          controlsOption = ControlsOption.Orbit,
                          cameraOption = CameraOption.perspective,
                          selectorOption = SelectorOption.renderOrder,
                          activeModelIndex = 0,
                       ...props
                   }: Props) => {

    if(props.urls.length!=2)
        throw new Error("2 urls must be supplied")

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mcl, setMcl] = useState<ModelCompareLogic>()
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

        const n_mcl = new ModelCompareLogic(canvasRef.current, id)
        n_mcl.init()

        setMcl(n_mcl)
    },[canvasRef.current])

    // set controls, when mcl is ready / controlsOption changes
    useEffect(()=>{
        mcl?.setControls(controlsOption)
    },[mcl, controlsOption])

    // set camera, when mcl is ready / cameraOption changes
    useEffect(()=>{
        mcl?.setCamera(cameraOption, controlsOption)
    }, [mcl, cameraOption])

    // set selector, when mcl is ready / selectorOption changes
    useEffect(()=>{
        mcl?.setSelector(selectorOption)
    },[mcl, selectorOption])

    // set index of active model, when mcl is ready / activeModelIndex changes
    useEffect(()=>{
        mcl?.setActive(activeModelIndex)
    },[mcl, activeModelIndex])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mcl)
            return;
        setLP(0)

        mcl.loadBoth(props.urls, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })

        return ()=>{
            mcl.removeLoaded()
        }
    },[mcl, props.urls, requestHeaders])

    return (
        <div style={style}>
            <span style={{ top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelCompare