import { vec3 } from "gl-matrix";
import { Particle } from "../ParticleService";


export const SparkleParticle = (args: {
    start: vec3;
}): Particle => {
    const { start } = args;
    return {
        life: 30,
        render: (x: number) => {
            const size = Math.random() * 0.5;
            return ({
                type: "Particle",
                particle: {
                    position: [start[0], start[1], start[2]],
                    size: [size, size],
                    r: 254.0 / 255.0,
                    g: 231.0 / 255.0,
                    b: 97.0 / 255.0,
                }
            });
        },
    };
};

