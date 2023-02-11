import React from "react";
import ModelView from "../src/ModelView";
import {ControlsOption} from "../src/builders/ControlsBuilder";
const env = require('../env.json')

if(!env.token){
    throw new Error('Missing token')
}

export default {
    orbit: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                      controlsOption={ControlsOption.Orbit}
                        url={'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d'}
                        requestHeaders={{'Authorization': env.token}}
    />,
    trackball: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                          controlsOption={ControlsOption.Trackball}
                          url={'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d'}
                          requestHeaders={{'Authorization': env.token}}
    />,
    jail: <ModelView style={{width: '99%', height: '98%', position: 'absolute'}}
                      url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                      requestHeaders={{'Authorization': env.token}}
    />,
    double: <div>
        <ModelView style={{position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'}}
                   url={'http://109.123.202.213:3000/models/6371826358b03a003a9de77d'}
                   requestHeaders={{'Authorization': env.token}}
        />
        <ModelView style={{position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}}
                   url={'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d'}
                   requestHeaders={{'Authorization': env.token}}
        />
    </div>
}