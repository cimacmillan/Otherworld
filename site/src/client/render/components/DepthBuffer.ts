import { fill } from "../../util/math/Array";

export class DepthBuffer {

    public data: number[];
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.data = Array(width * height).fill(0);
        this.width = width;
        this.height = height;
    }

    public isCloser(x: number, y: number, distance: number) {
        const index = (y * this.width) + x;
        return (1.0 / distance > this.data[index]);
    }

    public setDistance(x: number, y: number, distance: number) {
        const index = (y * this.width) + x;
        this.data[index] = 1.0 / distance;
    }

    public forceSet(x: number, y: number, set: number) {
        const index = (y * this.width) + x;
        this.data[index] = 0;
    }

    public reset() {
        fill(this.data, 0);
    }
}
