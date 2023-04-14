import React, {useEffect, useRef, useState} from "react";
import {ControlsOption} from "../builders/ControlsBuilder";
import * as IDAuthority from '../misc/IDAuthority'
import ModelViewLogic from "../logic/ModelViewLogic";
import {CameraOption} from "../builders/CameraBuilder";
import {EnvironmentParams} from "../builders/SceneBuilder";
import {ModelFormat} from "../misc/ModelLoader";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    url: string,
    modelFormat?: ModelFormat
    controlsOption?: ControlsOption,
    cameraOption?: CameraOption
    environmentParams?: EnvironmentParams
}

const ModelView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsOption.Orbit,
                       cameraOption = CameraOption.perspective,
                       modelFormat = ModelFormat.gltf,
                       ...props
                    }: Props) => {

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mvl, setMvl] = useState<ModelViewLogic>()
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

        const n_mvl = new ModelViewLogic(canvasRef.current, id)
        n_mvl.init()

        setMvl(n_mvl)
    },[canvasRef.current])

    // set background and ground color, when mvl is ready / environmentParams changes
    useEffect(()=>{
        mvl?.setEnvironment( props.environmentParams )
    }, [mvl, props.environmentParams])

    // set controls, when mv is ready / controlsOption changes
    useEffect(()=>{
        mvl?.setControls(controlsOption)
    },[mvl, controlsOption])

    // set camera, when mvl is ready / cameraOption changes
    useEffect(()=>{
        mvl?.setCamera(cameraOption, controlsOption)
    }, [mvl, cameraOption])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mvl)
            return;
        setLP(0)

        mvl.loadModel(modelFormat, props.url, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            //console.log(progress.loaded, progress.total)
            setLP(progress.loaded/progress.total)
        }).then(()=>{
            setLP(100)
        })

        return ()=>{
            mvl.removeLoaded()
        }
    },[mvl, props.url, modelFormat, requestHeaders])

    return (
        <div style={style}>
            <span style={{ top: '0px', left: '0px'}}>{loadPercentage}</span>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView