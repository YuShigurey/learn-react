// @ts-ignore
import useStore from "../../pages/stored";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";
import {otherComponents, structures} from "../../pages/readSource";
import SpawnStandardPolygon from "./StandardPolygon";
import SpawnComponentLineHelper from "./LineHelper";
import React from "react";

export function Arena({
                          controls,
                          cameraOf,
                          lerping,
                          setLerping,
                          lookFrom,
                          lookAt,
                          hooks: {SetInformation},
                          forceAlpha1,
                          info
                      }: {
    controls: any
    cameraOf: any
    lerping: any
    setLerping: any
    lookFrom: any
    lookAt: any
    hooks: {SetInformation: any},
    forceAlpha1: any
    info: any
}) {
    const [cameraC,] = cameraOf
    const {viewMode} = useStore()
    const {position: cameraPosition,} = cameraC

    useFrame(({camera}, delta) => {
        if (lerping) {
            camera.position.lerp(lookFrom, 1)

            let _lookAt
            if (viewMode === "XY") {
                _lookAt = new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z - 10)
                // camera.rotation.set(0, 0, 0)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(0, 1, 0)
            } else if (viewMode === "XZ") {
                _lookAt = new Vector3(cameraPosition.x, cameraPosition.y + 10, cameraPosition.z)
                // camera.rotation.set(0, PI/2, PI/2)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(0, 0, 1)
            } else if (viewMode === "YZ") {
                _lookAt = new Vector3(cameraPosition.x - 10, cameraPosition.y, cameraPosition.z)
                // camera.rotation.set(-PI/2, 0, 0)
                controls.current.target.lerp(_lookAt, 1)
                camera.up.set(0, 0, 1)
            } else {
                // controls.current.target.lerp(lookAt, 0.5)
            }
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
                        key={i}/>
                ).filter((e) => e)
            }
            {
                otherComponents.map(
                    (s, i) => <SpawnComponentLineHelper
                        info={info}
                        compInfo={s}
                        key={i}/>
                ).filter((e) => e)
            }
        </>
    )
}