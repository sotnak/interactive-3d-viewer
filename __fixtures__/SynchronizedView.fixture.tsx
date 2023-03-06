import React from "react";
import SynchronizedView from '../src/SynchronizedView'
import {CursorEventOption, CursorStyleOption} from "../src/cursors/CursorOptions";

const env = require('../env.json')

export default {
    default: <SynchronizedView
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,

    noStyle: <SynchronizedView
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,

    lineCursor: <SynchronizedView
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorOption={{style: CursorStyleOption.line}}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
    sphereCursor: <SynchronizedView
        styles={[
            {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
            {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
        ]}
        cursorOption={{style: CursorStyleOption.sphere}}
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />,
    lineMoveCursor: <SynchronizedView
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