import * as THREE from "three"
import ModelSelector from "./ModelSelector";

export default class RenderOrderSelector implements ModelSelector{
    activateModel(model: THREE.Group): void {
        model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=999

                obj.castShadow = true
                obj.receiveShadow = true

                obj.material.side = THREE.DoubleSide
                obj.material.depthWrite = true
            }
        })
    }

    deactivateModel(model: THREE.Group): void {
        model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=0

                obj.castShadow = false
                obj.receiveShadow = false

                obj.material.side = THREE.FrontSide
                obj.material.depthWrite = false
            }
        })
    }

    resetModel(model: THREE.Group): void {
        model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                obj.renderOrder=0

                obj.castShadow = true
                obj.receiveShadow = true

                obj.material.side = THREE.DoubleSide
                obj.material.depthWrite = true
            }
        })
    }
}