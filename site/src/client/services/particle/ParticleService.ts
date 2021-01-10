import { ConsistentArray } from "../../util/array/ConsistentArray";
import { Particle } from "../render/types/RenderInterface";
import { ServiceLocator } from "../ServiceLocator";

// interface Particle {

// }

interface ParticleEmitter {}

function getParticle(): Particle {
    const x = Math.random() - 0.5;
    const y = Math.random() - 0.5;
    return {
        position: [31.5 + x, 30.5],
        size: [0.1, 0.1],
        height: 0.5 + y,
        r: 255,
        g: 0,
        b: 0,
    };
}

export class ParticleService {
    private serviceLocator: ServiceLocator;
    private particles: ConsistentArray<Particle>;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.particles = new ConsistentArray();
    }

    public update() {}

    public addEmitter(emitter: ParticleEmitter) {
        this.serviceLocator
            .getRenderService()
            .particleRenderService.createItem(getParticle());
    }

    public removeEmitter(emitter: ParticleEmitter) {}
}
