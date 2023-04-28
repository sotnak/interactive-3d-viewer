import React, {useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import {ControlsOption} from "../builders/ControlsBuilder";
import {CameraOption} from "../builders/CameraBuilder";
import * as IDAuthority from "../misc/IDAuthority";
import ModelCompareLogic from "../logic/ModelCompareLogic";
import {SelectorOption} from "../builders/SelectorBuilder";
import {EnvironmentParams} from "../builders/SceneBuilder";
import {Model} from "../loading/ModelLoader";
import {ProgressBar} from "react-bootstrap";
import CustomModal from "../misc/CustomModal";


interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    models: Model[]
    controlsOption?: ControlsOption,
    cameraOption?: CameraOption
    selectorOption?: SelectorOption
    activeModelIndex?: number
    environmentParams?: EnvironmentParams
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

    if(props.models.length!=2)
        throw new Error("2 models must be supplied")

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mcl, setMcl] = useState<ModelCompareLogic>()
    const [loadPercentage, setLP] = useState<number>(0)

    const [errorMessage, setEM] = useState<string | undefined>(undefined)

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

    // set background and ground color, when mvl is ready / environmentParams changes
    useEffect(()=>{
        mcl?.setEnvironment( props.environmentParams )
    }, [mcl, props.environmentParams])

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

        mcl.loadBothModels(props.models, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            setLP( (progress.loaded/progress.total) * 100 )
        }).then(()=>{
            setLP(100)
        }).catch((e)=>{
            setEM(e.message)
            throw e;
        })

        return ()=>{
            mcl.removeLoaded()
        }
    },[mcl,
        props.models[0].url, props.models[0].format,
        props.models[1].url, props.models[1].format,
        requestHeaders])

    return (
        <div style={style}>
            <ProgressBar animated={false} now={loadPercentage} label={`${loadPercentage}%`} style={{position:'relative', zIndex:1, top:0, left:0, right:0}} />
            <canvas ref={canvasRef} />

            {errorMessage ? <CustomModal messsage={errorMessage} handleClose={ ()=>{setEM(undefined)} }/> : null}
        </div>
    );
}

export default ModelCompare