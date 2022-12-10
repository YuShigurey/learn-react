import {ThreeElements} from "@react-three/fiber";
import React, {useRef, useState} from "react";
import * as THREE from "three";
import {useCursor} from "@react-three/drei";
import useStore from "../../pages/stored"

export default function SpawnBox(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const setTarget = useStore((state) => state.setTarget)
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)
    return (
        <mesh
            {...props}
            ref={mesh}
            onClick={(e) => {setTarget(e.object); setClicked(!clicked)}}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            {/*<meshNormalMaterial />*/}
            {/*<meshStandardMaterial />*/}
            {/*<meshStandardMaterial color={'#AA0055'}/>*/}
            <meshStandardMaterial transparent opacity={0.3} color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}