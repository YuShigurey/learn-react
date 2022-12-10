import {ThreeElements} from "@react-three/fiber";
import React, {useRef} from "react";
import * as THREE from "three";

const PI = Math.PI

function AxisPlane(props: ThreeElements['mesh']){
    const mesh = useRef<THREE.Mesh>(null!)
    const geometry = new THREE.PlaneGeometry( 1, 1 );
    return (
        <mesh
            {...props}
            ref={mesh}
            geometry={geometry}
        >
            <meshStandardMaterial transparent opacity={1} color={'white'} />
        </mesh>
    )
}

export default function CreateAxs(){
    return (
        <>
            <AxisPlane />
            <gridHelper />

            <AxisPlane rotation={[-PI/2, 0, 0]}/>
            <gridHelper rotation={[-PI/2, 0, 0]}/>

            <AxisPlane rotation={[0, PI/2, 0]}/>
            <gridHelper rotation={[0, 0, PI/2]}/>
        </>
    )
}
