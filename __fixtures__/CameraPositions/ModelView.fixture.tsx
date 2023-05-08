import {ControlsOption} from "../../src/builders/ControlsBuilder";
import {CameraOption} from "../../src/builders/CameraBuilder";
import ModelView from "../../src/views/ModelView";
import React, {useRef} from "react";
import {ModelFormat} from "../../src/loading/ModelLoader";
import ComponentRef from "../../src/misc/ComponentRef";
import {CameraPositions} from "../../src/misc/PredefinedCamerasModule";

const env = require('../../env.json')

if(!env.token){
    throw new Error('Missing token')
}

const style: {[p: string]: string} = {width: '80%', height: '600px'}
const model = {url: 'http://109.123.202.213:3000/models/6371826358b03a003a9de77d', format: ModelFormat.gltf}

export default ()=>{

    const ref = useRef< ComponentRef >(null)

    return <>
        <ModelView style={style}
                      model={ model }
                      requestHeaders={{'Authorization': env.token}}
                      controlsOption={ControlsOption.Orbit}
                      cameraOption={CameraOption.perspective}
                      ref={ref}
        />
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.left)} } > left camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.right)} } > right camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.front)} } > front camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.rear)} } > rear camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.up)} } > up camera </button>
    </>
}