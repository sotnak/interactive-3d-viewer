import React from "react";
import ModelCompare from '../src/ModelCompare'

const env = require('../env.json')

export default {
    default: <ModelCompare
        urls={['http://109.123.202.213:3000/models/6371826358b03a003a9de77d', 'http://109.123.202.213:3000/models/62556f89d41c1c0038689e4d']}
        requestHeaders={{'Authorization': env.token}}
    />
}