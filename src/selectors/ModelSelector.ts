import * as THREE from "three"

export default interface ModelSelector{
    activateModel(model: THREE.Group): void
    deactivateModel(model: THREE.Group): void
    resetModel(model: THREE.Group): void
}