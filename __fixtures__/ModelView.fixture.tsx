import React from "react";
import ModelView from "../src/views/ModelView";
import {ControlsOption} from "../src/builders/ControlsBuilder";
import {CameraOption} from "../src/builders/CameraBuilder";

const env = require('../env.json')

if(!env.token){
    throw new Error('Missing token')
}

const style: {[p: string]: string} = {width: '99%', height: '98%', position: 'absolute'}

export default
{
    default: <ModelView style={style}
                      url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                      requestHeaders={{'Authorization': env.token}}
    />,
    trackball: <ModelView style={style}
                          controlsOption={ControlsOption.Trackball}
                          url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                          requestHeaders={{'Authorization': env.token}}
    />,
    orthographic: <ModelView style={style}
                            url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                            requestHeaders={{'Authorization': env.token}}
                            cameraOption={CameraOption.orthographic}
    />,
    noStyle: <ModelView url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                        requestHeaders={{'Authorization': env.token}}
    />,
    redAndBlue: <ModelView style={style}
                           url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                           requestHeaders={{'Authorization': env.token}}
                           environmentParams={ { fog:{color:{r:50,g:0,b:0}, near:1, far:150}, ground:{color:{r:0,g:0,b:50}}, grid:{color:{r:255,g:255,b:255}} } }
    />,
}