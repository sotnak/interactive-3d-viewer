import React from "react";
import ModelCompare from "../src/views/ModelCompare";
import {CameraOption} from "../src/builders/CameraBuilder";
import {ControlsOption} from "../src/builders/ControlsBuilder";


const env = require('../env.json')
const urls = ['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']
const style: {[p: string]: string} = {width: '99%', height: '98%', position: 'absolute'}

export default
{
    default: <ModelCompare urls={urls}
                           requestHeaders={{'Authorization': env.token}}
                           style={style}
                           activeModelIndex={0}
    />,
    opacity: <ModelCompare urls={urls}
                           requestHeaders={{'Authorization': env.token}}
                           style={style}
                           activeModelIndex={0}
                           selectorOption={1}
    />,
    trackball: <ModelCompare urls={urls}
                             requestHeaders={{'Authorization': env.token}}
                             style={style}
                             controlsOption={ControlsOption.Trackball}
                             activeModelIndex={0}
    />,
    orthographic: <ModelCompare urls={urls}
                                requestHeaders={{'Authorization': env.token}}
                                style={style}
                                cameraOption={CameraOption.orthographic}
                                activeModelIndex={0}
    />,
    redAndBlue: <ModelCompare urls={urls}
                              requestHeaders={{'Authorization': env.token}}
                              style={style}
                              activeModelIndex={0}
                              environmentParams={ { fog:{color:{r:50,g:0,b:0}, near:1, far:150}, ground:{color:{r:0,g:0,b:50}}, grid:{color:{r:255,g:255,b:255}} } }
    />,
}