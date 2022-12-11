import React, {useState} from "react";
import useStore from "../../pages/stored"
// import {MeshStandardMaterial, DoubleSide, BufferGeometry} from "three";
import {Structure3Refined} from "../../pages/sourceType"
import {useCursor} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {DoubleSide} from "three";
import {button, useControls} from "leva";

const hide = button(
    () => console.log("NotImplemented!!"),
    {disabled: true}
)

// @ts-ignore
export default function SpawnStandardPolygon({structureInfo, forceAlpha1, hooks, ...props}) {
    const setTarget = useStore((state) => state.setTarget)
    const { viewMode } = useStore()
    const { camera } = useThree()
    const [clicked, setClicked] = useState(false)
    const [hovered, ] = useState(false)
    const { SetInformation } = hooks;
    // console.log(structureInfo.mesh_order)
    // console.log("camera", camera.position)
    useControls(
        "Modify", () => ({
            hide: hide
        })
    )


    useCursor(hovered)

    const info: Structure3Refined = structureInfo
    const { alpha: stAlpha, color, verticesFor3: _vertices} = info;
    let vertices
    let count = 0

    let [xC, yC, zC] = [0, 0, 0]

    let overrideX : number | null, overrideY : number | null, overrideZ : number | null
    switch (viewMode) {
        case "XY":
            overrideZ = camera.position.z;
            vertices = _vertices.map((v, i) => {
                if (i % 3 === 2) {
                    if (v > camera.position.z-1e-10) {
                        count++;
                    }
                    // return Math.min(v, camera.position.z-1e-10)
                }
                return v
            });
            break;
        case "XZ":
            overrideY = camera.position.y;
            vertices = _vertices.map((v, i)=>{
                if (i % 3 === 1) {
                    if (v > camera.position.y-1e-10) {
                        count++;
                    }
                    // return Math.min(v, camera.position.y-1e-10)
                }
                return v

            });
            break;
        case "YZ":
            overrideX = camera.position.x;
            vertices = _vertices.map((v, i)=>{
                if (i % 3 === 0) {
                    if (v > camera.position.x-1e-10) {
                        count++;
                    }
                    // return Math.min(v, camera.position.x-1e-10)
                }
                return v

            });
            break;
        default:
            vertices = _vertices
            break;
    }
    // if (count === vertices.length/3) {
    //     // console.log("skipped", structureInfo.name)
    //     return <></>
    // }
    _vertices.forEach((e, i) => {
        if (i % 3 === 0) xC+=e
        else if (i % 3 === 1) yC+=e
        else if (i % 3 === 2) zC+=e
    })
    let [xCenter, yCenter, zCenter] = [xC, yC, zC].map((e) => e * 3 /vertices.length)
    vertices = vertices.map((e, i) => {
        if (i % 3 === 0) return e - xCenter
        else if (i % 3 === 1) return e - yCenter
        else if (i % 3 === 2) return e - zCenter
        else {
            console.error(i, " i % 3 not in [0, 1, 2], impossible.")
            return e
        }
    })

    let alpha: number

    if (forceAlpha1 === -1) {
        alpha = stAlpha;
    } else {
        alpha = forceAlpha1;
    }

    // const geometry = new BufferGeometry()
    // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    // const material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent:true, opacity:0.5, side: DoubleSide} );
    // const mesh = new THREE.Mesh( geometry, material );
    // return <primitive object={mesh} position={[0, 0, 0]} />

    return (
        <mesh
            {...props}
            position={ [xCenter, yCenter, zCenter] }
            onClick={(e) => {
                setTarget(e.object);
                hide.settings.disabled = false;
                setClicked(!clicked);
                SetInformation({
                    "cursor pos": {
                        x: overrideX ?? e.point.x,
                        y: overrideY ?? e.point.y,
                        z: overrideZ ?? e.point.z
                    }
                });
            }
            }
            // onPointerOver={() => setHovered(true)}
            // onPointerOut={() => setHovered(false)}
        >
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={vertices.length / 3}
                    array={vertices}
                    itemSize={3}
                />
            </bufferGeometry>
            <meshBasicMaterial transparent opacity={alpha} color={`#${color}`} side={DoubleSide}/>
        </mesh>
    )
}
