
import { vec3 } from "gl-matrix";
import { Particle, ParticleEmitter } from "../ParticleService";

export interface BurstEmitterType {
    emitter: ParticleEmitter;
}

export const BurstEmitter = (args: {
    creator: (position: vec3) => Particle;
    position: vec3;
    rate: number,
}): BurstEmitterType => {
    const { creator, position, rate } = args;
    const range = 1;
    const sample = () => (Math.random() * range) - (range / 2);
    return {
        emitter: {
            rate,
            createParticle: () => {
                const x = sample();
                const y = sample();
                const z = sample();
                return creator([position[0] + x, position[1] + y, position[2] + z]);
            },
        },
    };
};


