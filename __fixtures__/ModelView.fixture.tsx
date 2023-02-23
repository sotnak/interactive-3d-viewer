import React from "react";
import ModelView from "../src/ModelView";
import {ControlsOption} from "../src/builders/ControlsBuilder";
import {CursorEventOption, CursorStyleOption} from "../src/cursors/Enums";

const env = require('../env.json')

if(!env.token){
    throw new Error('Missing token')
}

export default {
    orbit: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                      url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                        requestHeaders={{'Authorization': env.token}}
    />,
    trackball: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                          controlsOption={ControlsOption.Trackball}
                          url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                          requestHeaders={{'Authorization': env.token}}
    />,
    noStyle: <ModelView url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                     requestHeaders={{'Authorization': env.token}}
    />,
    lineCursor: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                           cursorOption={{style: CursorStyleOption.line}}
                           url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                           requestHeaders={{'Authorization': env.token}}
    />,
    sphereCursor: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                             cursorOption={{style: CursorStyleOption.sphere}}
                             url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                             requestHeaders={{'Authorization': env.token}}
    />,
    lineMoveCursor: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                               cursorOption={{
                                   style: CursorStyleOption.line,
                                   event: CursorEventOption.pointermove
                               }}
                               url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                               requestHeaders={{'Authorization': env.token}}
    />,
}