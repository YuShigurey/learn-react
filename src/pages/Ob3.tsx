import React, {Fragment, useRef, useState} from 'react'
import {Canvas, ThreeElements} from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import create from 'zustand'
import {
    GridHelper,
    Matrix4,
    Vector3,
    OrthographicCamera,
    LineBasicMaterial,
    MeshBasicMaterial,
    MeshStandardMaterial
} from "three";
import * as THREE from "three";
import {useThree} from "react-three-fiber";

const PI = Math.PI;

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


function Box(props: ThreeElements['mesh'] & {hooks: any}) {
    const mesh = useRef<THREE.Mesh>(null!)
    const setTarget = useStore((state) => state.setTarget)
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    const {set} = props.hooks
    console.log("set", set)

    useCursor(hovered)
    return (
        <mesh
            {...props}
            ref={mesh}
            onClick={(e) => {
                setTarget(e.object);
                setClicked(!clicked);
                console.log(e.point);
                set({
                        position: {
                            x: e.point.x,
                            y: e.point.y,
                            z: e.point.z
                        }
                });
            }
        }
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


function AxisAll(props: ThreeElements['group'] & {cameraChanged: number, planeOn:boolean}){
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

export default function Scene() {
    const { target, setTarget } = useStore()
    const [cameraChanged, SetCameraChanged] = useState(0)
    let cccount = 0;

    const [c, set] = useControls(
        () => ({
            mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } ,
            // x: { value: x.toString(), editable: false},
            // y: { value: y.toString(), editable: false},
            // z: { value: z.toString(), editable: false},
            position: {
                x: 10,
                y: 10,
                z: 10,
            },
            camera: {}

        })
    )


    // @ts-ignore
    const mode: "scale" | "translate" | "rotate" = c.mode
    // @ts-ignore
    let {x, y, z} = c
    console.log(x, y, z)
    console.log(mode)

    const boxPositions = [
        [1, 4, 0],
        [2, 8, 0],
        [3, 12, 10],
    ]
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Fragment>{
                <div className="hiddenContainer">
                    <p>Grid x = 0.2</p>
                </div>
            }</Fragment>
            <Canvas
                dpr={[2, 2]}
                onPointerMissed={() => setTarget(null)}
                orthographic camera={{ zoom: 100, position: [0, 0, 20] }}
            >
                {boxPositions.map((v, i) => <Box hooks={{set}} position={new Vector3(...v)} key={i}/>)}
                {/*{target && <TransformControls object={target} mode={mode} />}*/}
                {/*{target}*/}
                <OrbitControls makeDefault onChange={(e) => {
                    cccount = (cccount+1) % 10
                    if (cccount === 0)
                        SetCameraChanged((cameraChanged + 1) % 10000000000007)
                }
                } />
                <AxisAll cameraChanged={cameraChanged} planeOn={false}/>

                {/*<axesHelper args={[10]}/>*/}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
        </div>
    )
}
