import React, { useRef, useState} from 'react'
import {Canvas, useFrame } from '@react-three/fiber'
import {OrbitControls, TransformControls} from '@react-three/drei'
import {button, useControls} from 'leva'
import useStore from "./stored"
import SpawnStandardPolygon from "../components/three/StandardPolygon";
import { structures, otherComponents } from "./readSource"
import {Vector3} from "three";
import {match} from "assert";
import SpawnComponentLineHelper from "../components/three/LineHelper";

export default function Scene() {
    const { target, setTarget, viewMode, setViewMode } = useStore()
    const ref = useRef<any>(null!)

    const [lerping, setLerping] = useState(false)
    const [lookAt, setLookAt] = useState(new Vector3(0, 0, 0))
    const [lookFrom, setLookFrom] = useState(new Vector3(0, 0, 10))
    // const [lookZoom, setLookZoom] = useState(5)
    const [lastViewMode, setLastViewMode] = useState("3D")
    const [controlSource, setControlSource] = useState("GUI")
    const [freezeControlSource, setFreezeControlSource] = useState(false)

    const [cameraC, cameraSet] = useControls(
        'Camera',
        () => ({
            position: {
                value: {
                    x: lookFrom.x,
                    y: lookFrom.y,
                    z: lookFrom.z,
                },
                onChange: (v) => {
                    // if (!freezeControlSource){
                    //     setControlSource("Panel")
                    // }
                },
                transient: false
            },
            lookAt: {
                value: {
                    x: lookAt.x,
                    y: lookAt.y,
                    z: lookAt.z,
                },
                onChange: (v) => {
                },
                transient: false
            },
            "reset look at" : button(() => {
                setLookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z))
                setLerping(true)
            })
        })
    )


    const { position: cameraPosition} = cameraC

    const [c, ] = useControls(
        'Control',
        () => ({
            Mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } ,
            Alpha: { value: 'use material', options: ['use material', 'force as 1', 'force as 0.2']},
            "Show Grid": {
                value: 'No',
                options: ['Yes', 'No']
            },
            "View Mode": {
                value: '3D',
                options: ['3D', 'XY', 'YZ', 'XZ'],
                onChange: (v) => {
                    setViewMode(v)
                    setControlSource("Panel")
                },
            },
        })
    )
    // @ts-ignore
    const mode: "scale" | "translate" | "rotate" = c.mode
    // @ts-ignore
    const showGrid = c["Show Grid"];
    const alpha = c.Alpha
    let forceAlpha1: number
    if (alpha === "force as 1") {
        forceAlpha1 = 1
    } else {
        forceAlpha1 = -1
    }
    // Change Camera settings
    if (
        controlSource === "Panel" && (
            Math.abs(lookFrom.x - cameraPosition.x) > 1e-6
        || Math.abs(lookFrom.y - cameraPosition.y) > 1e-6
        || Math.abs(lookFrom.z - cameraPosition.z) > 1e-6
        || lastViewMode !== viewMode
        )
    ) {
        setLastViewMode(viewMode)
        setLookFrom(new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z))
        setLerping(true)
    }

    const [, SetInformation] = useControls(
        'Information',
        () => ({
                "Cursor Position": {
                    x: 0,
                    y: 0,
                    z: 0,
                }
        })
    )

    console.log(target)
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas
                dpr={[2, 2]}
                onPointerDown={() => setLerping(false)}
                onWheel={() => setLerping(false)}
                onPointerMissed={() => setTarget(null)}
                orthographic
                camera={{ near:1e-10, zoom: 5, position: [cameraPosition.x, cameraPosition.y, cameraPosition.z] }}
            >
                {target && <TransformControls object={target} mode={mode} />}
                <OrbitControls
                    ref={ref}
                    target={lookAt}
                    onChange={(e)=>
                        {
                            if (controlSource==="GUI" && !target)
                                if (e !== undefined ){
                                    let camera = e.target.object
                                    cameraSet({
                                            position: {
                                                x: camera.position.x,
                                                y: camera.position.y,
                                                z: camera.position.z,
                                            },
                                        })
                                    setLookFrom(new Vector3(camera.position.x, camera.position.y, camera.position.z))
                                }
                        }
                    }
                    onStart={(e) => {
                        setFreezeControlSource(true)
                        setControlSource("GUI")
                    }}
                    onEnd={(e) => {
                        setFreezeControlSource(false)
                        setControlSource("Panel")
                    }}
                    makeDefault
                />
                <Arena
                    controls={ref}
                    // controlSource={controlSource}
                    cameraOf={[cameraC, cameraSet]}
                    lerping={lerping}
                    setLerping={setLerping}
                    lookAt={lookAt}
                    lookFrom={lookFrom}
                    // setLookFrom={setLookFrom}
                    // zoom={lookZoom}
                    forceAlpha1={forceAlpha1}
                    hooks={{SetInformation}}
                />
                {/*{(showGrid==="Yes")? <CreateAxs/>: null}*/}
                {/*<axesHelper args={[10]}/>*/}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
        </div>
    )
}


// @ts-ignore
function Arena({ controls, cameraOf, lerping, setLerping, lookFrom, lookAt, hooks:{SetInformation}, forceAlpha1}) {
    const [cameraC, cameraSet] = cameraOf
    const { viewMode } = useStore()
    const { position: cameraPosition, zoom: cameraZoom} = cameraC
    const PI = Math.PI

    useFrame(({ camera }, delta) => {
        if (lerping) {
            camera.position.lerp(lookFrom, 1)

            let _lookAt
            const camera2 = controls.current.object
            if (viewMode === "XY") {
                _lookAt = new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z - 10)
                // camera.rotation.set(0, 0, 0)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(0, 0, -1)
            } else if (viewMode === "XZ") {
                _lookAt = new Vector3(cameraPosition.x, cameraPosition.y + 10, cameraPosition.z)
                // camera.rotation.set(0, PI/2, PI/2)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(0, 1, 0)
            } else if (viewMode === "YZ") {
                _lookAt = new Vector3(cameraPosition.x - 10, cameraPosition.y, cameraPosition.z)
                // camera.rotation.set(-PI/2, 0, 0)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(1, 0, 1)
            } else {
                // controls.current.target.lerp(lookAt, 0.5)
            }

            // camera2.rotation.set(...camera.rotation)
            // camera2.up.set(camera.up.x, camera.up.y, camera.up.z)

        }
    })
    return (
        <>
            {
                structures.map(
                    (s, i) => <SpawnStandardPolygon
                        forceAlpha1={forceAlpha1}
                        structureInfo={s}
                        hooks={{SetInformation}}
                        key={i} />
                ).filter((e) => e)
            }
            {
                otherComponents.map(
                    (s, i) => <SpawnComponentLineHelper
                        compInfo={s}
                        key={i} />
                ).filter((e) => e)
            }
        </>
    )

}