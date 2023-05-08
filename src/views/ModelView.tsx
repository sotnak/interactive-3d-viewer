import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import {ControlsOption} from "../builders/ControlsBuilder";
import * as IDAuthority from '../misc/IDAuthority'
import ModelViewLogic from "../logic/ModelViewLogic";
import {CameraOption} from "../builders/CameraBuilder";
import EnvironmentParams from "../misc/EnvironmentParams";
import {Model} from "../loading/ModelLoader";
import {ProgressBar} from "react-bootstrap";
import CustomModal from "../misc/CustomModal";
import ComponentRef from "../misc/ComponentRef";
import ControlsSensitivity from "../misc/ControlsSensitivity";

interface Props {
    style?: React.CSSProperties
    requestHeaders?: {[p: string]: string}
    model: Model
    controlsOption?: ControlsOption,
    cameraOption?: CameraOption
    environmentParams?: EnvironmentParams,
    sensitivity?: ControlsSensitivity
}

const ModelView = React.forwardRef<{resetCamera: ()=>void}, Props>(({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsOption.Orbit,
                       cameraOption = CameraOption.perspective,
                       ...props
                    }: Props, ref?: React.Ref<ComponentRef>) => {

    if( style.height || (style.top && style.bottom) ){} else {
        style.height = 450
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mvl, setMvl] = useState<ModelViewLogic>()
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

    // set controls sensitivity, when mvl is ready / sensitivity changes
    useEffect(()=>{
        mvl?.setSensitivity(props.sensitivity)
    }, [mvl, props.sensitivity])

    // load model, when mv is ready / url or requestHeaders changes
    useEffect(()=>{
        if(!mvl)
            return;
        setLP(0)

        mvl.loadModel(props.model, requestHeaders, (progress)=>{
            //https://discourse.threejs.org/t/gltfloader-onprogress-total-is-always-0/5735
            setLP( (progress.loaded/progress.total) * 100 )
        }).then(()=>{
            setLP(100)
        }).catch((e)=>{
            setEM(e.message)
            throw e;
        })

        return ()=>{
            mvl.removeLoaded()
        }
    },[mvl, props.model.url, props.model.format, requestHeaders]);

    useImperativeHandle(ref, ()=>({
        resetCamera() {
            mvl?.resetCamera()
        }
    }), [mvl]);

    return (
        <div style={style}>
            <ProgressBar animated={false} now={loadPercentage} label={`${loadPercentage}%`} style={{position:'relative', zIndex:1, top:0, left:0, right:0}} />
            <canvas ref={canvasRef}/>

            {errorMessage ? <CustomModal messsage={errorMessage} handleClose={ ()=>{setEM(undefined)} }/> : null}
        </div>
    );
})

export default ModelView