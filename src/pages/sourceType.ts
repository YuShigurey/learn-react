import {Matrix4, BufferGeometry, BufferAttribute} from "three";

export interface Structure3 {
    vertices: [number, number, number][]
    faces: [number, number, number][]
    name: string
    color: string
    alpha: number
    mesh_order: number
}

export interface OtherComponent {
    name: string
    type: string
    region: [[number, number, number], [number, number, number]]
    theta: number
    phi: number
    axis: number
}

export interface Structure3Refined extends Structure3{
    verticesFor3: Float32Array
}

export interface StructureFile {
    structures: Structure3[]
    other_components: OtherComponent[]
}

export interface OtherComponentRefined{
    points: Float32Array
    type: string
}

export function get8Points(o: OtherComponent): Float32Array{
    const [p0, p1] = o.region
    const {phi: roll, theta: pitch, axis} = o;
    const yaw = 0;

    let traMat = new Matrix4()
    let traBackMat = new Matrix4()
    traBackMat.makeTranslation((p0[0] + p1[0])/2, (p0[1] + p1[1])/2, (p0[2] + p1[2])/2)
    traMat.makeTranslation(-(p0[0] + p1[0])/2, -(p0[1] + p1[1])/2, -(p0[2] + p1[2])/2)

    let rotMat = new Matrix4()
    let rotMatZ = new Matrix4()
    let rotMatY = new Matrix4()
    let rotMatX = new Matrix4()

    let alpha, theta, ro: number
    if (axis === 0) {  // yz
        [alpha, theta, ro] = [ yaw, roll, pitch ]
    } else if (axis === 1) { // xz
        [alpha, theta, ro] = [ roll, yaw, pitch ]
    } else {
        [alpha, theta, ro] = [ roll, pitch, yaw ]
    }

    rotMatZ.makeRotationZ(ro)
    rotMatY.makeRotationY(theta)
    rotMatX.makeRotationX(alpha)
    rotMat.multiplyMatrices(rotMatZ, rotMatY)
    rotMat.multiply(rotMatX)


    const geometry = new BufferGeometry();
    // TODO: maybe use `rotMat.makeOrthographic()` ?
    const vertices = new Float32Array([
        p0[0], p0[1], p0[2],
        p1[0], p0[1], p0[2],
        p1[0], p1[1], p0[2],
        p0[0], p1[1], p0[2],
        p0[0], p0[1], p1[2],
        p1[0], p0[1], p1[2],
        p1[0], p1[1], p1[2],
        p0[0], p1[1], p1[2],
    ])
    geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
    geometry.applyMatrix4(traMat).applyMatrix4(rotMat).applyMatrix4(traBackMat)
    let points: Float32Array = new Float32Array(geometry.getAttribute('position').array)
    return points
}