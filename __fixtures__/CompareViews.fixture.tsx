import React from "react";
import CompareViews from '../src/views/CompareViews'
import {CursorEventOption, CursorStyleOption} from "../src/cursors/CursorOptions";
import {CameraOption} from "../src/builders/CameraBuilder";

const env = require('../env.json')

const styles: {[p: string]: string}[] = [
    {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
    {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
]

const models = [{url: 'http://109.123.202.213:3000/models/63074a95436ca90038a65720'}, {url: 'http://109.123.202.213:3000/models/6307ec890f6bbd0038ff2471'}]

export default
{
    default: <CompareViews styles={styles}
                           models={models}
                           requestHeaders={{'Authorization': env.token}}
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
                              environmentParams={ { fog:{color:{r:50,g:0,b:0}, near:1, far:150}, ground:{color:{r:0,g:0,b:50}}, grid:{color:{r:255,g:255,b:255}} } }
    />,
}