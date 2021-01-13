import { vec3 } from "gl-matrix";
import { Particle, ParticleEmitter } from "../ParticleService";

export interface LineEmitterType {
    emitter: ParticleEmitter;
    setRate: (rate: number) => void;
    setStart: (start: vec3) => void;
    setEnd: (end: vec3) => void;
}

export const LineEmitter = (args: {
    creator: (position: vec3) => Particle;
    initialStart: vec3;
    initialEnd: vec3;
    initialRate: number;
}): LineEmitterType => {
    const { creator, initialStart, initialEnd, initialRate } = args;
    let start = initialStart;
    let end = initialEnd;
    let rate = initialRate;
    return {
        emitter: {
            rate,
            createParticle: () => {
                const grad = Math.random();
                const diff = vec3.sub(vec3.create(), end, start);
                const toAdd = vec3.scale(vec3.create(), diff, grad);
                const position = vec3.add(vec3.create(), start, toAdd);
                return creator(position);
            },
        },
        setRate: (x) => (rate = x),
        setStart: (x) => (start = x),
        setEnd: (x) => (end = x),
    };
};
