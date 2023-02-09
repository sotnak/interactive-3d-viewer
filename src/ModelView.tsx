import React, {useEffect, useRef, useState} from "react";
import * as RendererBuilder from './builders/RendererBuilder';
import * as SceneBuilder from './builders/SceneBuilder'
import * as ModelLoader from './misc/ModelLoader'
import * as ControlsBuilder from './builders/ControlsBuilder'
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import getParentElement from "./misc/getParentElement";
import {getCallerId, getValidAnimate, registerNewAnimate} from "./misc/AnimateIdHandler";

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

    const [id, setId] = useState<number>(0)

    const [canvas, setCanvas] = useState<HTMLCanvasElement>()
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
    const [scene, setScene] = useState<THREE.Scene>()
    const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
    const [controls, setControls] = useState<OrbitControls | TrackballControls>()

    useEffect(()=>{
        setId(getCallerId())
    },[])

    // set canvas
    useEffect(()=>{
        if(!canvasRef.current)
            return;

        const canvasAttr = canvasRef.current.getAttribute("data-engine")

        if(canvasAttr)
            return;

        console.log("set canvas")

        setCanvas(canvasRef.current)
    }, [canvasRef])

    // after canvas is ready set renderer, camera and scene
    useEffect(()=>{
        if(!canvas)
            return;

        console.log("set renderer, camera, scene")

        setRenderer(RendererBuilder.build(canvas))

        const parent = getParentElement(canvas)

        setCamera(SceneBuilder.buildCamera(parent.clientWidth, parent.clientHeight))

        setScene(SceneBuilder.build())
    }, [canvas])

    // after canvas, camera and renderer are ready enable canvas resizing
    useEffect(()=>{
        if(!canvas || !camera || !renderer)
            return;

        console.log("enable resizing")

        RendererBuilder.enableResizing(canvas, camera, renderer);

    },[canvas, camera, renderer]);

    // after canvas and camera are ready set controls
    // alternatively set controls on controlsOption change
    useEffect(()=>{
        if(!canvas || !camera)
            return;

        console.log("set controls")

        setControls(ControlsBuilder.build(canvas, camera, controlsOption))
    }, [canvas, camera, controlsOption])

    // after controls, renderer, camera and scene are ready run animate (render loop)
    useEffect(()=>{

        if(!controls || !renderer || !camera || !scene)
            return;

        const animateId = registerNewAnimate(id);

        const animate = () => {
            // stop rendering after newer animate is registered
            if(animateId !== getValidAnimate(id)) {
                controls.dispose()
                console.log("animate interrupted")
                return;
            }

            requestAnimationFrame(animate)

            controls.update();

            renderer.render(scene, camera)
        }

        console.log("animate", {caller: id, animate: animateId})

        animate()
    },[controls, renderer, camera, scene, id])

    // after scene is ready load model
    //alternatively on url change load model
    useEffect(()=>{
        if(!scene)
            return;

        console.log("loading", props.url)

        ModelLoader.removeLoaded(scene);
        ModelLoader.loadGLTF(props.url, requestHeaders, scene).then( () => {} );
    },[props.url, scene])

    return (
        <div style={style}>
            <canvas ref={canvasRef}/>
        </div>
    );
}

export default ModelView