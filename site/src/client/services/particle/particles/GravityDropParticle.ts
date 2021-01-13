import { vec3 } from "gl-matrix";
import { Particle } from "../ParticleService";

export const GravityDropParticle = (args: {
    life: number;
    r: number;
    g: number;
    b: number;
    start: vec3;
}): Particle => {
    const { life, r, g, b, start } = args;
    return {
        life,
        render: (x: number) => {
            const grav = x * x * x;
            return {
                position: [start[0], start[1] - grav, start[2]],
                size: [0.1, 0.1],
                r,
                g,
                b,
            };
        },
    };
};
