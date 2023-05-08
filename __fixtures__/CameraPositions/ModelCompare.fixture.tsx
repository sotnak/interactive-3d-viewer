import React, {useRef} from "react";
import ModelCompare from '../../src/views/ModelCompare'
import {CameraOption} from "../../src/builders/CameraBuilder";
import {ModelFormat} from "../../src/loading/ModelLoader";
import ComponentRef from "../../src/misc/ComponentRef";
import {ControlsOption} from "../../src/builders/ControlsBuilder";
import {CameraPositions} from "../../src/misc/PredefinedCamerasModule";

const env = require('../../env.json')

const style: {[p: string]: string} = {width: '80%', height: '600px'}

const models = [
    {url: 'http://109.123.202.213:3000/models/63074a95436ca90038a65720', format: ModelFormat.gltf},
    {url: 'http://109.123.202.213:3000/models/6307ec890f6bbd0038ff2471', format: ModelFormat.gltf}
]

export default ()=>{

    const ref = useRef<ComponentRef>(null)

    return <>
        <ModelCompare style={style}
                      models={models}
                      requestHeaders={{'Authorization': env.token}}
                      cameraOption={CameraOption.perspective}
                      controlsOption={ControlsOption.Orbit}
                      ref={ref}
        />
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.left)} } > left camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.right)} } > right camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.front)} } > front camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.rear)} } > rear camera </button>
        <button onClick={ ()=>{ref.current?.moveCamera(CameraPositions.up)} } > up camera </button>
    </>
}