import React from "react";
import ModelCompare from '../src/ModelCompare'

const env = require('../env.json')

export default {
    default: <ModelCompare
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,

    noStyle: <ModelCompare
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,

    withCursor: <ModelCompare
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorEnabled={true}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
}