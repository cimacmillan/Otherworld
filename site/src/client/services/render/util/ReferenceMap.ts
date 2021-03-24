import { vec3 } from "gl-matrix";



export class ReferenceMap<T> {
    private map: T[] = [];

    public constructor(
        private isEqual: (a: T, b: T) => boolean
    ) {

    } 

    public getMap(): T[] {
        return this.map;
    }

    public getID(a: T): number {
        const id = this.map.findIndex((value: T, index: number) => this.isEqual(value, a));
        if (id >= 0) {
            return id;
        }
        const newId = this.map.push(a);
        return (newId - 1);
    }
}

export class ColourMap extends ReferenceMap<vec3> {
    public constructor() {
        super((a: vec3, b: vec3) => {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
        })
    }
}

