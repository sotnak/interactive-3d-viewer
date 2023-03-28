import ModelSelector, {ComparableModel, ComparableState} from "./ModelSelector";
import * as THREE from "three";

const multiplier = 4

export default class OpacitySelector implements ModelSelector{

    protected makeSolid(mesh: THREE.Mesh){
        //@ts-ignore
        mesh.material.opacity = mesh.material.opacity * multiplier;

        mesh.castShadow = true
        mesh.receiveShadow = true
    }

    protected makeSemitransparent(mesh: THREE.Mesh){
        //@ts-ignore
        mesh.material.opacity = mesh.material.opacity / multiplier

        mesh.castShadow = false
        mesh.receiveShadow = false
    }

    activateModel(model: ComparableModel): void {

        switch (model.state) {
            case ComparableState.default:
                break;

            case ComparableState.active:
                return;

            case ComparableState.inactive:
                model.model.traverse((obj)=>{
                    if(obj instanceof THREE.Mesh){
                        this.makeSolid(obj)
                    }
                })
                break;
        }

        model.state = ComparableState.active
    }

    deactivateModel(model: ComparableModel): void {
        if(model.state == ComparableState.inactive)
            return;

        model.model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                this.makeSemitransparent(obj)
            }
        })

        model.state = ComparableState.inactive
    }

    resetModel(model: ComparableModel): void {

        switch (model.state) {
            case ComparableState.default:
                return;

            case ComparableState.active:
                break;

            case ComparableState.inactive:
                model.model.traverse((obj)=>{
                    if(obj instanceof THREE.Mesh){
                        this.makeSolid(obj)
                    }
                })
                break;
        }

        model.state = ComparableState.default
    }

}