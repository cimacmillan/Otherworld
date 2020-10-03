import { SCENERYSPRITES } from "../resources/manifests/Types";
import { MapSchema } from "../resources/MapShema";
import { block } from "./scenery/Block";

export type MapGenerator = (seed: number) => MapSchema;

export const MazeGenerator = (): MapGenerator => (seed: number) => {
    let seedrandom = require("seedrandom");
    let random = seedrandom(seed); // or any seed.

    const longWall = [];

    for (let i = 0; i < 100; i++) {
        longWall.push(...block(0, -10 - i, 1, 1, SCENERYSPRITES.WALL));
    }

    return {
        walls: longWall,
        floors: [],
    };
};

export const CaveGenerator = MazeGenerator();
