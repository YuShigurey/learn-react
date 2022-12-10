import {ThreeElements} from "@react-three/fiber";
import React, {useRef} from "react";
import * as THREE from "three";
import {useThree} from "react-three-fiber";


const PI = Math.PI

function AxisPlane(props: ThreeElements['mesh']){
    const mesh = useRef<THREE.Mesh>(null!)
    return (
        <mesh
            {...props}
            ref={mesh}
        >
            <planeGeometry args={[10, 10]}/>
            <meshStandardMaterial transparent opacity={1} color={'white'} />
        </mesh>
    )
}
function AxisOne(props: ThreeElements['group']){
    // @ts-ignore
    let planeOn = props.planeOn
    let visible
    if (planeOn)
        visible = props.visible
    else
        visible = props.visible
    return (
        <group {...props}>
            <gridHelper visible={visible}/>
            {planeOn && <AxisPlane rotation-x={-PI/2}/>}
        </group>
    )
}


export function AxisAll(props: ThreeElements['group'] & {cameraChanged: number, planeOn:boolean}){
    let [x, y, z]= [0, 0, 0];

    useThree(({camera}) => {
        // camera.rotation.set(deg2rad(30), 0, 0);
        x = camera.position.x
        y = camera.position.y
        z = camera.position.z
    });

    console.log(x, y, z)


    return (
        <group {...props}>
            <AxisOne position={[5, 0, 5]} rotation-x={0} visible={y>0} />
            <AxisOne position={[0, 5, 5]} rotation-z={-PI/2}  visible={x>0} />
            <AxisOne position={[5, 5, 0]} rotation-x={PI/2}  visible={z>0} />
            <AxisOne position={[5, 10, 5]} rotation-x={PI}  visible={y<10} />
            <AxisOne position={[10, 5, 5]} rotation-z={PI/2} visible={x<10} />
            <AxisOne position={[5, 5, 10]} rotation-x={-PI/2} visible={z<10} />
        </group>
    )
}
