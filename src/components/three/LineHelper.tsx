import React, {useState} from "react";
import useStore from "../../pages/stored"
// import {MeshStandardMaterial, DoubleSide, BufferGeometry} from "three";
import {OtherComponentRefined} from "../../pages/sourceType"
import {useCursor} from "@react-three/drei";
import {DoubleSide} from "three";

// @ts-ignore
export default function SpawnComponentLineHelper({compInfo, info: colorInfo, ...props}) {
    const setTarget = useStore((state) => state.setTarget)
    const { viewMode } = useStore()
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)

    useCursor(hovered)

    const info: OtherComponentRefined = compInfo
    const { points, type } = info;

    let color
    console.log(type)
    color = colorInfo[type] ?? "#FFFFFF"

    const rearrange = (arr: Float32Array, ...idxs: number[]) => {
        let ret = []
        for (let idx of idxs) {
            ret.push(...arr.slice(idx*3,idx*3+3))
        }
        return new Float32Array(ret)
    }
    let lines = new Float32Array(
        [
            ...points,
            ...rearrange(points, 0, 3, 1, 2, 4, 7, 5, 6),
            ...rearrange(points, 0, 4, 1, 5, 2, 6, 3, 7),
        ]
    )

    return (
        <mesh
            {...props}
        >
            <lineSegments >
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={lines.length / 3}
                        array={lines}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial transparent color={color} linewidth={1} side={DoubleSide}/>
            </lineSegments >
        </mesh>
    )
}
