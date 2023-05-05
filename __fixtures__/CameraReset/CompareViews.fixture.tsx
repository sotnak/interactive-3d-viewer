import React, {useRef} from "react";
import CompareViews from '../../src/views/CompareViews'
import {CameraOption} from "../../src/builders/CameraBuilder";
import {ModelFormat} from "../../src/loading/ModelLoader";
import ComponentRef from "../../src/misc/ComponentRef";

const env = require('../../env.json')

const styles: {[p: string]: string}[] = [
    {width:'49%', height: '600px', float: 'left'},
    {width:'49%', height: '600px', float: 'left'}
]
const models = [
    {url: 'http://109.123.202.213:3000/models/63074a95436ca90038a65720', format: ModelFormat.gltf},
    {url: 'http://109.123.202.213:3000/models/6307ec890f6bbd0038ff2471', format: ModelFormat.gltf}
]

export default ()=>{

    const ref = useRef<ComponentRef>(null)

    return <>
        <CompareViews styles={styles}
                      models={models}
                      requestHeaders={{'Authorization': env.token}}
                      cameraOption={CameraOption.perspective}
                      ref={ref}
        />
        <button onClick={ ()=>{ref.current?.resetCamera()} } > reset camera </button>
    </>
}