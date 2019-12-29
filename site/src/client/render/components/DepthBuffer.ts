import { fill } from "../../util/math/Array";

export class DepthBuffer {

    data: number[];
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.data = Array(width * height).fill(0);
        this.width = width;
        this.height = height;
    }

    isCloser(x: number, y: number, distance: number) {
        let index = (y * this.width) + x;
        return (1.0 / distance > this.data[index]);
    }

    setDistance(x: number, y: number, distance: number) {
        let index = (y * this.width) + x;
        this.data[index] = 1.0 / distance;
    }

    forceSet(x: number, y: number, set: number) {
        let index = (y * this.width) + x;
        this.data[index] = 0;
    }

    reset() {
        fill(this.data, 0);
    }
}
