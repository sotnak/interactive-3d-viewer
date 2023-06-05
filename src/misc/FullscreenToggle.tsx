import {Button} from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css'
import React, {useEffect} from "react";

//const buttonStyle: {[p: string]: string} = {position:"absolute", bottom:"0px", right:"10vw"}
const fullscreenbuttonStyle: {[p: string]: string} = {position:"absolute", bottom:"0px", right:"0%"}
const buttonStyle = fullscreenbuttonStyle

interface Props{
    isFullscreen: boolean
    setIsFS: React.Dispatch<React.SetStateAction<boolean>>
    divRef:  React.RefObject<HTMLDivElement>
}

const FullscreenToggle = (props: Props) => {

    function requestFullscreen(){
        if(props.divRef.current?.requestFullscreen){
            props.divRef.current.requestFullscreen()
            //@ts-ignore
        } else if (props.divRef.current?.mozRequestFullScreen) {
            //@ts-ignore
            props.divRef.current.mozRequestFullScreen()
            //@ts-ignore
        } else if (props.divRef.current?.webkitRequestFullScreen) {
            //@ts-ignore
            props.divRef.current.webkitRequestFullScreen()
        }
    }

    function exitFullscreen(){
        if(document.exitFullscreen){
            document.exitFullscreen()
            //@ts-ignore
        } else if(document.mozCancelFullScreen) {
            //@ts-ignore
            document.mozCancelFullScreen()
            //@ts-ignore
        } else if (document.webkitCancelFullScreen) {
            //@ts-ignore
            document.webkitCancelFullScreen()
        }
    }

    useEffect(()=>{
        document.addEventListener("fullscreenchange", (_)=>{
            if(!document.fullscreenElement){
                props.setIsFS(false)
            }
        })
    },[props.setIsFS])

    return <Button style={props.isFullscreen ? fullscreenbuttonStyle : buttonStyle} variant={"primary"}
                   onClick={()=>{
                       if(!props.isFullscreen) {
                           requestFullscreen()
                           props.setIsFS(true)
                       } else {
                           exitFullscreen()
                           props.setIsFS(false)
                       }
                   }}>
        <span className={props.isFullscreen ? "bi bi-fullscreen-exit" : "bi bi-fullscreen"}/>
    </Button>
}

export default FullscreenToggle;