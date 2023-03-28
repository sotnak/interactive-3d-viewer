import ModelSelector, {ComparableModel, ComparableState} from "./ModelSelector";
import * as THREE from "three";

const multiplier = 4

export default class OpacitySelector implements ModelSelector{

    protected makeOpaque(mesh: THREE.Mesh){
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

    activate(model: ComparableModel): void {

        switch (model.state) {
            case ComparableState.default:
                break;

            case ComparableState.active:
                return;

            case ComparableState.inactive:
                model.model.traverse((obj)=>{
                    if(obj instanceof THREE.Mesh){
                        this.makeOpaque(obj)
                    }
                })
                break;
        }

        model.state = ComparableState.active
    }

    deactivate(model: ComparableModel): void {
        if(model.state == ComparableState.inactive)
            return;

        model.model.traverse((obj)=>{
            if(obj instanceof THREE.Mesh){
                this.makeSemitransparent(obj)
            }
        })

        model.state = ComparableState.inactive
    }

    reset(model: ComparableModel): void {

        switch (model.state) {
            case ComparableState.default:
                return;

            case ComparableState.active:
                break;

            case ComparableState.inactive:
                model.model.traverse((obj)=>{
                    if(obj instanceof THREE.Mesh){
                        this.makeOpaque(obj)
                    }
                })
                break;
        }

        model.state = ComparableState.default
    }

}