import * as THREE from "three"
import ModelSelector, {ComparableModel, ComparableState} from "./ModelSelector";

export default class RenderOrderSelector implements ModelSelector{
    activate(model: ComparableModel): void {

        if(model.state == ComparableState.active)
            return

        model.model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=999

                obj.castShadow = true
                obj.receiveShadow = true

                obj.material.side = THREE.DoubleSide
                obj.material.depthWrite = true
            }
        })

        model.state = ComparableState.active
    }

    deactivate(model: ComparableModel): void {

        if(model.state == ComparableState.inactive)
            return

        model.model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=0

                obj.castShadow = false
                obj.receiveShadow = false

                obj.material.side = THREE.FrontSide
                obj.material.depthWrite = false
            }
        })

        model.state = ComparableState.inactive
    }

    reset(model: ComparableModel): void {

        if(model.state == ComparableState.default)
            return

        model.model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=0

                obj.castShadow = true
                obj.receiveShadow = true

                obj.material.side = THREE.DoubleSide
                obj.material.depthWrite = true
            }
        })

        model.state = ComparableState.default
    }
}