import { MapSchema } from "../../MapShema";

export default {
    walls: [
        {
            startx: -10,
            starty: -10,
            endx: 10,
            endy: -10,
            height: 2,
        },
        {
            startx: -10,
            starty: -10,
            endx: -10,
            endy: 10,
            height: 2,
        },
        {
            startx: 10,
            starty: -10,
            endx: 10,
            endy: 10,
            height: 2,
        },
        {
            startx: -10,
            starty: 10,
            endx: -0.5,
            endy: 20,
            height: 2,
        },
        {
            startx: 10,
            starty: 10,
            endx: 0.5,
            endy: 20,
            height: 2,
        },
        {
            startx: -0.5,
            starty: 20,
            endx: -0.5,
            endy: 30,
            height: 2,
        },
        {
            startx: 0.5,
            starty: 20,
            endx: 0.5,
            endy: 30,
            height: 2,
        },
    ],

    floors: [
        {
            startx: -50,
            starty: -50,
            endx: 50,
            endy: 50,
        },
        {
            startx: -50,
            starty: -50,
            endx: 50,
            endy: 50,
            height: 2,
        },
    ],
} as MapSchema;
