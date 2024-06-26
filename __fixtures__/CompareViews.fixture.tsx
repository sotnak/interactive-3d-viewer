import React from "react";
import CompareViews from '../src/views/CompareViews'
import {CursorEventOption, CursorStyleOption} from "../src/cursors/CursorOptions";
import {CameraOption} from "../src/builders/CameraBuilder";
import {ModelFormat} from "../src/loading/ModelLoader";

const env = require('../env.json')

const styles: {[p: string]: string}[] = [
    {width: '45vw', height: '60vh', float: 'left'},
    {width: '45vw', height: '60vh', float: 'left'}
]
const models = [
    {url: 'http://109.123.202.213:3000/models/63074a95436ca90038a65720', format: ModelFormat.gltf},
    {url: 'http://109.123.202.213:3000/models/6307ec890f6bbd0038ff2471', format: ModelFormat.gltf}
]

export default
{
    default: <CompareViews styles={styles}
                           models={models}
                           requestHeaders={{'Authorization': env.token}}
                           sensitivity={ {zoom: 1, pan: 1, rotate: 1} }
                           environmentParams={ {grid:{showAxes: true}} }
    />,
    orthographic: <CompareViews styles={styles}
                                models={models}
                                requestHeaders={{'Authorization': env.token}}
                                cameraOption={CameraOption.orthographic}
    />,
    noStyle: <CompareViews models={models}
                           requestHeaders={{'Authorization': env.token}}
    />,
    lineCursor: <CompareViews styles={styles}
                              cursorOption={{style: CursorStyleOption.line}}
                              models={models}
                              requestHeaders={{'Authorization': env.token}}
    />,
    sphereCursor: <CompareViews styles={styles}
                                cursorOption={{style: CursorStyleOption.sphere}}
                                models={models}
                                requestHeaders={{'Authorization': env.token}}
    />,
    lineMoveCursor: <CompareViews styles={styles}
                                  cursorOption={{
                                      style: CursorStyleOption.line,
                                      event: CursorEventOption.pointermove
                                  }}
                                  models={models}
                                  requestHeaders={{'Authorization': env.token}}
    />,
    redAndBlue: <CompareViews styles={styles}
                              models={models}
                              requestHeaders={{'Authorization': env.token}}
                              environmentParams={ {
                                  fog:{color:{r:100,g:0,b:0}, near:1, far:150},
                                  ground:{color:{r:0,g:0,b:100}},
                                  grid:{color:{r:255,g:255,b:255}},
                                  light:{intensity: 2.5, color: {r:100, g:100, b:100}, useHemisphericColors: true } } }
    />,
}