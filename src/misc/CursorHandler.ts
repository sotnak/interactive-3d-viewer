import * as THREE from "three";

export const setCursor = (pointer: THREE.Vector2, raycaster: THREE.Raycaster, camera?: THREE.PerspectiveCamera, line?: THREE.Line<any, THREE.LineBasicMaterial>, loadedModel?: THREE.Group) => {

    const intersection = {
        intersects: false,
        point: new THREE.Vector3(),
        normal: new THREE.Vector3()
    };

    if(!camera || !loadedModel || !line)
        return intersection;

    raycaster.setFromCamera( pointer, camera );

    // See if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObject( loadedModel );

    if ( intersects.length > 0 ) {

        const p = intersects[ 0 ].point;
        intersection.point.copy( p );

        // @ts-ignore
        const n = intersects[0].face.normal.clone();
        n.transformDirection( loadedModel.matrixWorld );
        n.multiplyScalar( 10 );
        n.add( intersects[ 0 ].point );

        // @ts-ignore
        intersection.normal.copy( intersects[ 0 ].face.normal );

        const positions = line.geometry.attributes.position;
        positions.setXYZ( 0, p.x, p.y, p.z );
        positions.setXYZ( 1, n.x, n.y, n.z );
        positions.needsUpdate = true;

        intersection.intersects = true;

        intersects.length = 0;

        line.visible = true;

    } else {

        intersection.intersects = false;
        line.visible = false;

    }

    return intersection
}