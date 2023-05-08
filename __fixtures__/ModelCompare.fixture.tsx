import React from "react";
import ModelCompare from "../src/views/ModelCompare";
import {CameraOption} from "../src/builders/CameraBuilder";
import {ControlsOption} from "../src/builders/ControlsBuilder";
import {ModelFormat} from "../src/loading/ModelLoader";


const env = require('../env.json')
const models = [
    {url: 'http://109.123.202.213:3000/models/63074a95436ca90038a65720', format: ModelFormat.gltf},
    {url: 'http://109.123.202.213:3000/models/6307ec890f6bbd0038ff2471', format: ModelFormat.gltf}
]

const style: {[p: string]: string} = {width: '99%', height: '98%', position: 'absolute'}

export default
{
    default: <ModelCompare models={models}
                           requestHeaders={{'Authorization': env.token}}
                           style={style}
                           activeModelIndex={0}
                           sensitivity={ {zoom: 1, pan: 1, rotate: 1} }
    />,
    noStyle: <ModelCompare models={models}
                           requestHeaders={{'Authorization': env.token}}
                           activeModelIndex={0}
    />,
    opacity: <ModelCompare models={models}
                           requestHeaders={{'Authorization': env.token}}
                           style={style}
                           activeModelIndex={0}
                           selectorOption={1}
    />,
    trackball: <ModelCompare models={models}
                             requestHeaders={{'Authorization': env.token}}
                             style={style}
                             controlsOption={ControlsOption.Trackball}
                             activeModelIndex={0}
    />,
    orthographic: <ModelCompare models={models}
                                requestHeaders={{'Authorization': env.token}}
                                style={style}
                                cameraOption={CameraOption.orthographic}
                                activeModelIndex={0}
    />,
    redAndBlue: <ModelCompare models={models}
                              requestHeaders={{'Authorization': env.token}}
                              style={style}
                              activeModelIndex={0}
                              environmentParams={ {
                                  fog:{color:{r:100,g:0,b:0}, near:1, far:150},
                                  ground:{color:{r:0,g:0,b:100}},
                                  grid:{color:{r:255,g:255,b:255}},
                                  light:{intensity: 2.5, color: {r:100, g:100, b:100}, useHemisphericColors: true } } }
    />,
}