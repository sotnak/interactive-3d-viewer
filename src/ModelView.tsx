import React, {useEffect, useRef} from "react";
import * as RendererBuilder from './builders/RendererBuilder';
import * as SceneBuilder from './builders/SceneBuilder'
import * as ModelLoader from './misc/ModelLoader'
import * as ControlsBuilder from './builders/ControlsBuilder'
import * as THREE from "three";

function getParent(element: HTMLElement): HTMLElement {
    if(!element.parentElement){
        throw new Error('Unable to find parent element');
    }

    return element.parentElement
}

interface Props {
    style: React.CSSProperties,
    requestHeaders: {[p: string]: string},
    url: string,
    controlsOption: ControlsBuilder.ControlsOption
}

const ModelView = ({
                       style = {},
                       requestHeaders = {},
                       controlsOption = ControlsBuilder.ControlsOption.Orbit,
                       ...props
                    }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current
            const renderer = RendererBuilder.build(canvas)

            const parent = getParent(canvas)

            const camera = new THREE.PerspectiveCamera( 70, parent.clientWidth / parent.clientHeight, 1, 1000 );
            camera.position.y = 150;
            camera.position.z = 500;

            const scene = SceneBuilder.build()

            const controls = ControlsBuilder.build(canvas, camera, controlsOption)

            RendererBuilder.enableResizing(canvas, camera, renderer);

            ModelLoader.loadGLTF(props.url, requestHeaders, scene)

            const animate = () => {
                requestAnimationFrame(animate)

                controls.update();

                renderer.render(scene, camera)
            }

            animate()
        }
    },[canvasRef.current])

    return (
        <div style={style}>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView