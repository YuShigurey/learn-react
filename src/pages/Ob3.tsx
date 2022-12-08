import React, {Fragment, useRef, useState} from 'react'
import {Canvas, ThreeElements} from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import create from 'zustand'
import {GridHelper, Matrix4, Vector3} from "three";
import * as THREE from "three";

const useStore = create(
    (set: any) => (
        {
            target: null,
            setTarget: (target: any) => set({ target }),
            x: -1,
            setX: (x: number) => set({x}),
            y: -1,
            setY: (y: number) => set({y}),
            z: -1,
            setZ: (z: number) => set({z}),
        }
    )
)


function Box(props: ThreeElements['mesh']) {
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

function AxisPlane(props: ThreeElements['mesh']){
    const mesh = useRef<THREE.Mesh>(null!)
    const geometry = new THREE.PlaneGeometry( 1, 1 );
    const {x, y, z} = useStore();
    console.log("xyz")
    console.log(x, y, z)

    // const m = new Matrix4()
    const mt = new Matrix4()
    mt.makeTranslation(x, y, z)
    geometry.applyMatrix4(mt)
    // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    return (
        <mesh
            {...props}
            ref={mesh}
            geometry={geometry}
        >
            {/*<meshNormalMaterial />*/}
            {/*<meshStandardMaterial />*/}
            {/*<meshStandardMaterial color={'#AA0055'}/>*/}
            <meshStandardMaterial transparent opacity={1} color={'white'} />
        </mesh>
)
}

export default function Scene() {
    const { target, setTarget } = useStore()
    const c = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } })
    // @ts-ignore
    const mode: "scale" | "translate" | "rotate" = c.mode
    const {x, y, z} = useStore();
    const mt = new Matrix4()
    mt.makeTranslation(x, y, z)

    const gh = new GridHelper()
    gh.geometry.applyMatrix4(mt)

    const boxPositions = [
        [2, 2, 0],
        [10, 2, 0],
        [10, 2, 10],
    ]
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            {/*<Fragment>{*/}
            {/*    <div className="hiddenContainer">*/}
            {/*        <p>Your hidden text</p>*/}
            {/*    </div>*/}
            {/*}</Fragment>*/}
            <Canvas
                dpr={[2, 2]}
                onPointerMissed={() => setTarget(null)}
            >
                {boxPositions.map((v, i) => <Box position={new Vector3(...v)} key={i}/>)}
                {target && <TransformControls object={target} mode={mode} />}
                <OrbitControls makeDefault />
                <AxisPlane />
                <axesHelper args={[10]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
        </div>
    )
}
