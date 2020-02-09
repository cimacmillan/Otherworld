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

    public isCloserAndSet(x: number, y: number, distance: number) {
        const index = (y * this.width) + x;
        if (1.0 / distance > this.data[index]) {
            this.data[index] = 1.0 / distance;
            return true;
        }
        return false;
    }

    public isCloserAndSetInv(x: number, y: number, invDistance: number) {
        const index = (y * this.width) + x;
        if (invDistance > this.data[index]) {
            this.data[index] = invDistance;
            return true;
        }
        return false;
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
