
import { vec3 } from "gl-matrix";
import { Particle, ParticleEmitter } from "../ParticleService";

export interface SpawnEmitterType {
    emitter: ParticleEmitter;
}

export const SpawnEmitter = (args: {
    creator: (position: vec3) => Particle;
    position: vec3;
    rate: number,
}): SpawnEmitterType => {
    const { creator, position, rate } = args;
    let angle = 0;
    return {
        emitter: {
            rate,
            createParticle: () => {
                angle += 0.5;
                const x = Math.sin(angle) * 0.5;
                const z = Math.cos(angle) * 0.5;
                return creator([position[0] + x, position[1], position[2] + z]);
            },
        },
    };
};


