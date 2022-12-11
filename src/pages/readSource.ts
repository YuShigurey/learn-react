import {StructureFile, Structure3Refined, get8Points} from "./sourceType"
// @ts-ignore
// import raw from "./project.txt"
// console.log('raw', fetch(raw))
// const structureData: StructureFile = require('./project.json')
const structureData: StructureFile = _structureData

const {structures: _structures, other_components: _otherComponents} = structureData;

export const structures = _structures.map((e, _) => {
    let vertices: number[] = [];
    for (let face of e.faces) {
        for (let pidx of face){
            vertices.push(...e.vertices[pidx])
        }
    }
    let ret: Structure3Refined = {
        ...e,
        'verticesFor3': new Float32Array(vertices)
    }
    return ret
})
// .sort((a, b)=>(a.mesh_order-b.mesh_order))

export const otherComponents = _otherComponents.map((o, _) => ({
    points: get8Points(o),
    type: o.type
}))

export const usedTypes = otherComponents.map(e => e.type)



