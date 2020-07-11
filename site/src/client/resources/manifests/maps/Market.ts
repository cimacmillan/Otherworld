import { MapSchema, WallSchema } from "../../MapShema";
import { SCENERYSPRITES } from "../Types";

function block(
    startx: number,
    starty: number,
    width: number,
    depth: number,
    texture: number,
    height?: number,
    offset?: number,
    collides?: boolean
) {
    return [
        {
            startx,
            starty,
            endx: startx + width,
            endy: starty,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx: startx + width,
            starty,
            endx: startx + width,
            endy: starty + depth,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx: startx + width,
            starty: starty + depth,
            endx: startx,
            endy: starty + depth,
            height,
            offset,
            texture,
            collides,
        },
        {
            startx,
            starty: starty + depth,
            endx: startx,
            endy: starty,
            height,
            offset,
            texture,
            collides,
        },
    ];
}

function hex(
    x: number,
    y: number,
    radius: number,
    subdiv: number,
    height?: number,
    offset?: number
) {
    const data: WallSchema[] = [];

    for (let i = 0; i < subdiv; i++) {
        const angle1 = (i / subdiv) * Math.PI * 2;
        const angle2 = ((i + 1) / subdiv) * Math.PI * 2;

        const startx = x + Math.sin(angle1) * radius;
        const starty = y + Math.cos(angle1) * radius;
        const endx = x + Math.sin(angle2) * radius;
        const endy = y + Math.cos(angle2) * radius;

        data.push({
            startx,
            starty,
            endx,
            endy,
            height,
            offset,
        });
    }

    return data;
}

function randomBlocks() {
    const blocks: WallSchema[] = [];

    const minRadius = 9;
    const maxRadius = 19;

    const amount = 100;

    const size = maxRadius * 2;
    const blockCount = new Array(size * size).fill(0);

    for (let i = 0; i < amount; i++) {
        const randGrad1 = Math.random();
        const radius = minRadius * randGrad1 + maxRadius * (1 - randGrad1);

        const angle = Math.random() * Math.PI * 2;

        const x = Math.floor(Math.sin(angle) * radius);
        const y = Math.floor(Math.cos(angle) * radius);

        const blockIndex = x + maxRadius + size * (y + maxRadius);

        blocks.push(
            ...block(
                x,
                y,
                1,
                1,
                SCENERYSPRITES.WALL,
                1,
                blockCount[blockIndex],
                true
            )
        );

        blockCount[blockIndex] += 1;
    }

    return blocks;
}

export default {
    walls: [
        // ...block(-20, -20, 40, 40, SCENERYSPRITES.WALL, 5, 0, true),
        ...block(-2, -2, 4, 4, SCENERYSPRITES.FLOOR, 1, 3, false),
        ...block(-5, -5, 10, 10, SCENERYSPRITES.FLOOR, 1, 4, false),
        ...hex(-1.5, -1.5, 0.5, 6, 3, 0),
        ...hex(1.5, -1.5, 0.5, 6, 3, 0),
        ...hex(1.5, 1.5, 0.5, 6, 3, 0),
        ...hex(-1.5, 1.5, 0.5, 6, 3, 0),

        ...hex(-4, -4, 0.8, 6, 4, 0),
        ...hex(4, -4, 0.8, 6, 4, 0),
        ...hex(4, 4, 0.8, 6, 4, 0),
        ...hex(-4, 4, -0.8, 6, 4, 0),

        ...block(10, 10, 20, 20, SCENERYSPRITES.WALL, 5, 0, true),
    ],

    floors: [
        {
            startx: -50,
            starty: -50,
            endx: 50,
            endy: 50,
        },
    ],
} as MapSchema;
