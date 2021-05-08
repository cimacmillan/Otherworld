import { ConsistentArray } from "../../util/array/ConsistentArray";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import { TextRender } from "../render/services/TextRenderService";
import { ParticleRender, RenderItem } from "../render/types/RenderInterface";
import { ServiceLocator } from "../ServiceLocator";

export type ParticleType = {
    type: "Particle",
    particle: ParticleRender
} | {
    type: "Text",
    particle: TextRender
}


export interface ParticleEmitter {
    // How many particles per frame
    rate: number;
    createParticle: () => Particle;
}

export interface Particle {
    // How many frames until death
    life: number;
    render: (x: number) => ParticleType;
}

class ParticleInstance {
    private x = 0;
    private renderItem: RenderItem;
    private type: "Particle" | "Text";

    public constructor(
        private serviceLocator: ServiceLocator,
        private particle: Particle,
        private removeSelf: () => void
    ) {
        const rendered = particle.render(0);
        this.type = rendered.type;
        this.renderItem = this.getRenderService().createItem(rendered.particle as any);
    }

    public update() {
        this.x += fpsNorm(1);
        if (this.x > this.particle.life) {
            this.getRenderService().freeItem(this.renderItem);
            this.removeSelf();
        } else {
            this.getRenderService().updateItem(
                this.renderItem,
                this.particle.render(this.x / this.particle.life).particle as any
            );
        }
    }

    private getRenderService() {
        switch (this.type) {
            case "Particle":
                return this.serviceLocator
                    .getRenderService()
                    .particleRenderService;
            case "Text":
                return this.serviceLocator
                    .getRenderService()
                    .textRenderService;
        }
    }
}

export class EmitterInstance {
    private elapsedFrames = 0;
    private createdParticles = 0;

    public constructor(public emitter: ParticleEmitter) {}

    public update(addParticle: (particle: Particle) => void) {
        this.elapsedFrames += fpsNorm(1);

        const target = Math.floor(this.elapsedFrames * this.emitter.rate);

        for (let x = this.createdParticles; x < target; x++) {
            addParticle(this.emitter.createParticle());
        }

        this.createdParticles = target;
    }
}

export class ParticleService {
    private serviceLocator: ServiceLocator;
    private particles: ConsistentArray<ParticleInstance>;
    private emitters: ConsistentArray<EmitterInstance>;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.particles = new ConsistentArray();
        this.emitters = new ConsistentArray();
    }

    public update() {
        this.particles.sync();
        this.emitters.sync();
        this.particles.getArray().forEach((particle) => particle.update());
        this.emitters
            .getArray()
            .forEach((emitter) =>
                emitter.update((particle) => this.addParticle(particle))
            );
    }

    public addEmitter(emitter: ParticleEmitter) {
        const instance = new EmitterInstance(emitter);
        this.emitters.add(instance);
    }

    public removeEmitter(emitter: ParticleEmitter) {
        const instance = this.emitters
            .getArray()
            .find((x) => x.emitter === emitter);
        this.emitters.remove(instance);
    }

    public getParticles() {
        return this.particles.getArray();
    }

    public addParticle(particle: Particle) {
        const instance: ParticleInstance = new ParticleInstance(
            this.serviceLocator,
            particle,
            () => this.particles.remove(instance)
        );
        this.particles.add(instance);
    }
}
