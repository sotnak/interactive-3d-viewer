import React from "react";
import ModelCompare from '../src/ModelCompare'
import {CursorEventOption, CursorStyleOption} from "../src/cursors/Enums";

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

    lineCursor: <ModelCompare
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorOption={{style: CursorStyleOption.line}}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
    sphereCursor: <ModelCompare
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorOption={{style: CursorStyleOption.sphere}}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
    lineMoveCursor: <ModelCompare
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorOption={{
            style: CursorStyleOption.line,
            event: CursorEventOption.pointermove
        }}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
}