import {CameraPositions} from "./PredefinedCamerasModule";

export default interface ComponentRef{
    resetCamera: ()=>void
    moveCamera: (position: CameraPositions)=>void
}