export interface RGBColor{
    r: number
    g:number
    b:number
}

export interface FogParams{
    color?: RGBColor
    near?: number
    far?: number
}

export interface GroundParams{
    color?: RGBColor
    depthWrite?: boolean
}

export interface GridParams{
    color?: RGBColor
    showAxes?: boolean
}

export interface LightParams{
    color?: RGBColor,
    intensity?: number
    useHemisphericColors?: boolean
}

export default interface EnvironmentParams{
    fog?: FogParams
    ground?: GroundParams
    grid?: GridParams
    light?: LightParams
}

export function RGBToString(rgb?: RGBColor){
    return rgb ? `rgb(${Math.floor(rgb.r)},${Math.floor(rgb.g)},${Math.floor(rgb.b)})` : undefined
}

export function dim(rgb?: RGBColor, rate: number = 2){
    if(rgb)
        return {r: rgb.r/rate, g: rgb.g/rate, b: rgb.b/rate};

    return rgb;
}