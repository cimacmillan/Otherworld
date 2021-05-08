import { vec3 } from "gl-matrix";
import { Particle } from "../ParticleService";

const LIFE = 30;
const SIZE = 0.2;
const HOP = 0.02;
const GRAV = 0.002;

export const HealthDropParticle = (args: {
    getAngle: () => number,
    damage: number;
    start: vec3;
}): Particle => {
    const { damage, start, getAngle} = args;
    let yVel = HOP / 10;
    let yPos = start[1];
    return {
        life: LIFE,
        render: (x: number) => {
            yPos += yVel;
            const angle = getAngle()
            return ({
                type: "Text",
                particle: {
                    contents: `${damage}`,
                    colour: {
                        r: 1,
                        g: 1,
                        b: 1
                    },
                    position: [start[0], start[2]],
                    height: yPos + SIZE,
                    size: SIZE,
                    angle,
                    horizontalPlacement: 0.5,
                    verticalPlacement: 0.5
                }
            });
        },
    };
};

export const DamageTextParticle = (args: {
    getAngle: () => number,
    damage: number;
    start: vec3;
}): Particle => {
    const { damage, start, getAngle} = args;
    let yVel = HOP;
    let yPos = start[1];
    return {
        life: LIFE,
        render: (x: number) => {
            yPos += yVel;
            yVel -= GRAV;
            const angle = getAngle()
            return ({
                type: "Text",
                particle: {
                    contents: `${damage}`,
                    colour: {
                        r: 138 / 255,
                        g: 3 / 255,
                        b: 3 / 255
                    },
                    position: [start[0], start[2]],
                    height: yPos,
                    size: SIZE,
                    angle,
                    horizontalPlacement: 0.5,
                    verticalPlacement: 0.5
                }
            });
        },
    };
};
