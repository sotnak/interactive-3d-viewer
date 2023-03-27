import React from "react";
import CompareViews from '../src/views/CompareViews'
import {CursorEventOption, CursorStyleOption} from "../src/cursors/CursorOptions";
import {CameraOption} from "../src/builders/CameraBuilder";

const env = require('../env.json')

const styles: {[p: string]: string}[] = [
    {position: 'absolute', width:'49%', left: '0px', top: '0px', bottom: '10px'},
    {position: 'absolute', width:'49%', right: '0px', top: '0px', bottom: '10px'}
]

const urls = ['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']

export default
{
    default: <CompareViews styles={styles}
                           urls={urls}
                           requestHeaders={{'Authorization': env.token}}
    />,

    orthographic: <CompareViews styles={styles}
                                urls={urls}
                                requestHeaders={{'Authorization': env.token}}
                                cameraOption={CameraOption.orthographic}
    />,
    noStyle: <CompareViews urls={urls}
                           requestHeaders={{'Authorization': env.token}}
    />,

    lineCursor: <CompareViews styles={styles}
                              cursorOption={{style: CursorStyleOption.line}}
                              urls={urls}
                              requestHeaders={{'Authorization': env.token}}
    />,
    sphereCursor: <CompareViews styles={styles}
                                cursorOption={{style: CursorStyleOption.sphere}}
                                urls={urls}
                                requestHeaders={{'Authorization': env.token}}
    />,
    lineMoveCursor: <CompareViews styles={styles}
                                  cursorOption={{
                                      style: CursorStyleOption.line,
                                      event: CursorEventOption.pointermove
                                  }}
                                  urls={urls}
                                  requestHeaders={{'Authorization': env.token}}
    />,
}