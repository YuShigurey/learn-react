import {Universe} from "./game-of-life"
import {wait} from "@testing-library/user-event/dist/utils";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

it("test --- shape", () => {
        console.log("Passing")
        let uni = new Universe([
            [0, 0, 0, 0, 0],  
            [0, 0, 1, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
        ])
        setInterval(
            () => {
                uni.describe()
                uni.evolve()
            },
            1000
        )
    }
)