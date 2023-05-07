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
    color: RGBColor
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
    return rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : undefined
}