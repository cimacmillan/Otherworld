import { vec3 } from "gl-matrix";
import { Particle } from "../ParticleService";


export const SmokeParticle = (args: {
    start: vec3;
}): Particle => {
    const { start } = args;
    const size = Math.random() * 1 + 0.4
    const drop = 0.3;
    return {
        life: 30,
        render: (x: number) => {
            return ({
                type: "Particle",
                particle: {
                    position: [start[0], start[1] + drop * x, start[2]],
                    size: [size,size],
                    r: 139.0 / 255.0,
                    g: 155.0 / 255.0,
                    b: 180.0 / 255.0,
                }
            });
        },
    };
};

