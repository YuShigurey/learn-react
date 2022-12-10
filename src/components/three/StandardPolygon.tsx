import React, {useState} from "react";
import useStore from "../../pages/stored"
// import {MeshStandardMaterial, DoubleSide, BufferGeometry} from "three";
import {Structure3Refined} from "../../pages/sourceType"
import {useCursor} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {DoubleSide} from "three";

// @ts-ignore
export default function SpawnStandardPolygon({structureInfo, forceAlpha1, hooks, ...props}) {
    const setTarget = useStore((state) => state.setTarget)
    const { viewMode } = useStore()
    const { camera } = useThree()
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    const { SetInformation } = hooks;
    // console.log(structureInfo.mesh_order)
    // console.log("camera", camera.position)

    useCursor(hovered)

    const info: Structure3Refined = structureInfo
    const { alpha: stAlpha, color, verticesFor3: _vertices} = info;
    let vertices
    let count = 0
    switch (viewMode) {
        case "XY":
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
    if (count === vertices.length/3) {
        // console.log("skipped", structureInfo.name)
        return <></>
    }

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


    // FIXME: This method is better, but I failed figure out how to make it working

    return (
        <mesh
            {...props}
            onClick={(e) => {
                setTarget(e.object);
                setClicked(!clicked);
                SetInformation({
                    "Cursor Position": {
                        x: e.point.x,
                        y: e.point.y,
                        z: e.point.z
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