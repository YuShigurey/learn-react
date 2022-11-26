import {Universe} from "./game-of-life"

it("test --- shape", () => {
        console.log("Passing")
        let uni = new Universe([
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ])
        uni.describe()
        uni.evolve()
        uni.describe()
    }
)