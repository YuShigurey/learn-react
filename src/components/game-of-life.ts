class Universe{
    ground: number[][]
    width: number
    height: number

    constructor(ground: number[][]) {
        this.ground = ground
        this.width = ground[0].length
        this.height = ground.length
    }

    evolve(){
        const nextGround = new Array(this.ground.length);
        for (let ri = 0; ri < this.ground.length; ri ++) {
            nextGround[ri] = [];
            for (let ci = 0; ci < this.ground[0].length; ci ++){
                let countOfLife = this.liveNeighborCount(ri, ci);
                if (countOfLife > 3) {
                    nextGround[ri][ci] = 0;
                } else if ( countOfLife === 3) {
                    nextGround[ri][ci] = 1;
                } else if ( countOfLife === 2) {
                    nextGround[ri][ci] = this.ground[ri][ci];
                } else {
                    nextGround[ri][ci] = 0;
                }
            }
        }
        this.ground = nextGround;
    }

    describe(){
        var str = ""
        for (let c of this.ground) {
            for (let n of c){
                if (n === 0){
                    str += "| |"
                } else {
                    str += "\u2588\u2588\u2588"
                }
            }
            str += "\n"
        }
        console.log(str)
    }

    liveNeighborCount(rowIndex: number, colIndex: number): number{
        let ret = 0;
        for (let dr of [this.height-1, 0, 1]) {
            for (let dc of [this.width-1, 0, 1]){
                if (dr === 0 && dc === 0){
                    continue
                }

                let ri = (rowIndex + dr) % this.height
                let ci = (colIndex + dc) % this.width
                ret += this.ground[ri][ci]
            }
        }
        return ret
    }
}

export {Universe}