import { RenderState } from "../state/render/RenderState";
import * as glm from "gl-matrix";
import { RenderInterface } from "./types/RenderInterface";
import { ResourceManager } from "../resources/ResourceManager";
import { SpriteRenderService } from "./services/SpriteRenderService";

export class RenderService implements RenderInterface {

    public spriteRenderService: SpriteRenderService;

    private count = 10000;
    private sqr = Math.floor(Math.sqrt(this.count));

    public constructor(private resourceManager: ResourceManager) {
        this.spriteRenderService = new SpriteRenderService();   
    }

    public init(renderState: RenderState) {
        this.spriteRenderService.init(renderState);
        this.spriteRenderService.attachSpritesheet(this.resourceManager.sprite);
        
        ///////
        for (let i = 0; i < this.count; i ++) {
            const xtex = 0.5 * Math.round(Math.random());
            const ytex = 0.5 * Math.round(Math.random());
            this.spriteRenderService.createItem(
                {
                    position: this.getPos(i),
                    size: [1, 1],
                    height: this.getHeight(i, this.time),
                    textureX: xtex,
                    textureY: ytex,
                    textureWidth: 0.5,
                    textureHeight: 0.5
                }
            );

        } 
    }

    private getPos(i: number): glm.vec2 {
        const scale = Math.abs((Math.cos(this.time) + 2) * 2) * 0.4;
        const x = ((i % this.sqr) - (this.sqr / 2)) * scale;
        const z = (Math.floor(i / this.sqr) - (this.sqr / 2)) * scale;

        const diss = (Math.sqrt(x * x + z * z) / 100) + ((Math.sin(this.time)) / 10);
        const diff = 1 / (diss + 1);

        const s = Math.sin(diss + this.time * diff);
        const c = Math.cos(diss + this.time * diff);

        const xTemp = c * x + z * s;
        const zTemp = c * z - x * s;

        return [xTemp, zTemp - (this.sqr / 2)];
    }

    private getHeight(i: number, time: number): number {
        const speed = 2;
        const height = Math.sin((i / this.count) * 100 + time * speed) + Math.cos((i % this.count) * 100 + time * speed);
        const x = ((i % this.sqr) - (this.sqr / 2));
        const z = (Math.floor(i / this.sqr) - (this.sqr / 2));
        const diss = (Math.sqrt(x * x + z * z + 100));
        return (height / diss) * 100;
    }

    private time = 0;

    public draw(renderState: RenderState) {
        this.spriteRenderService.draw(renderState);
        for (let i = 0; i < this.count; i ++) {
            this.spriteRenderService.updateItem({renderId: i + 1}, {
                position: this.getPos(i),
                height: this.getHeight(i, this.time)
            });
        } 
        this.time += 0.01;
    }

}