import useStore from "./stored"
import {Vector3} from "three";
import React, {useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls, TransformControls} from '@react-three/drei'
import {button, folder, Leva, useControls} from 'leva'
import {usedTypes} from "./readSource"
import {Arena} from "../components/three/Arena";

export default function Scene() {
    const { target, setTarget, viewMode, setViewMode } = useStore()
    const ref = useRef<any>(null!)

    const [lerping, setLerping] = useState(false)
    const [lookAt, setLookAt] = useState(new Vector3(0, 0, 0))
    const [lookFrom, setLookFrom] = useState(new Vector3(0, 0, 10))
    // const [lookZoom, setLookZoom] = useState(5)
    const [lastViewMode, setLastViewMode] = useState("3D")
    const [controlSource, setControlSource] = useState("GUI")
    const [, setFreezeControlSource] = useState(false)

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
            // lookAt: {
            //     value: {
            //         x: lookAt.x,
            //         y: lookAt.y,
            //         z: lookAt.z,
            //     },
            //     onChange: (v) => {
            //     },
            //     transient: false
            // },
            "reset look at (0,0,0)" : button(() => {
                // setLookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z))
                setLookAt(new Vector3(0,0,0))
                setLerping(true)
            })
        })
    )


    const { position: cameraPosition} = cameraC

    const [c, ] = useControls(
        'Control',
        () => ({
            mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } ,
            alpha: { value: 'use material', options: ['use material', 'force as 1', 'force as 0.2']},
            // "Show Grid": {
            //     value: 'No',
            //     options: ['Yes', 'No']
            // },
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
    // const showGrid = c["Show Grid"];
    const alpha = c.alpha
    let forceAlpha1: number
    if (alpha === "force as 1") {
        forceAlpha1 = 1
    } else if (alpha === "force as 0.2") {
        forceAlpha1 = 0.2
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


    const colors = {}
    const presetColors = {
        FDTD: "#000000",
        EME: "#FFFFFF"
    }
    // @ts-ignore
    usedTypes.forEach(e=>{colors[e]=presetColors[e] ?? "#FFFFFF"})

    const [info, SetInformation] = useControls(
        'Information',
        () => ({
            "cursor pos": {
                x: 0,
                y: 0,
                z: 0,
            },
            colorSettings: folder(
                colors,
                {"collapsed": true}
            )
        })
    )

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
                    enableRotate={viewMode==="3D"}
                    enableDamping={false}
                    onChange={(e)=>
                    {
                        if (controlSource==="GUI")
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
                    info={info}
                />
                {/*{(showGrid==="Yes")? <CreateAxs/>: null}*/}
                {/*<axesHelper args={[10]}/>*/}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
        </div>
    )
}


