import { vec3 } from "gl-matrix";
import { Particle } from "../ParticleService";

export const SpawnParticle = (args: {
    start: vec3;
}): Particle => {
    const { start } = args;
    const drop = 1;
    return {
        life: 30,
        render: (x: number) => {
            const size = 0.4 * (1.0 - x);
            return ({
                type: "Particle",
                particle: {
                    position: [start[0], start[1] + drop * x, start[2]],
                    size: [size,size],
                    r: 224.0 / 255.0,
                    g: 90.0 / 255.0,
                    b: 209.0 / 255.0,
                }
            });
        },
    };
};

