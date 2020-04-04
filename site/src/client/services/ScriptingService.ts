import { CrabletLogicComponent } from "../engine/components/CrabletLogicComponent";
import { FlowerLogicComponent } from "../engine/components/FlowerLogicComponent";
import { SpriteLogicComponent } from "../engine/components/SpriteLogicComponent";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { Entity } from "../engine/Entity";
import { PlayerState } from "../engine/State";
import { getTextureCoordinate } from "../util/math";
import { ServiceLocator } from "./ServiceLocator";

/**
 * Service for quick commands that usually take more lines, eg
 * GameScriptingService.getSpawner().spawnMacator();
 * GameScriptingService.getPlayer().damage();
 */
export class ScriptingService {
    private serviceLocator: ServiceLocator;
    private player: Entity<PlayerState>;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.bootstrapContent();
    }

    public getPlayer() {
        return this.player;
    }

    private bootstrapContent() {
        const world = this.serviceLocator.getWorld();

        for (let i = 0; i < 10; i++) {
            const sprite = new Entity(
                this.serviceLocator,
                new SpriteRenderComponent(),
                new SpriteLogicComponent()
            );
            world.addEntity(sprite);
        }

        for (let i = 0; i < 1000; i++) {
            const sprite = new Entity(
                this.serviceLocator,
                new SpriteRenderComponent(),
                new FlowerLogicComponent()
            );
            world.addEntity(sprite);
        }

        for (let i = 0; i < 500; i++) {
            const sprite = new Entity(
                this.serviceLocator,
                new SpriteRenderComponent(),
                new CrabletLogicComponent()
            );
            world.addEntity(sprite);
        }

        const floorTexture = getTextureCoordinate(32, 64, 32, 32, 0, 32);
        this.serviceLocator.getRenderService().floorRenderService.createItem({
            startPos: [-10, -10],
            endPos: [10, 10],
            height: 0,
            textureX: floorTexture.textureX,
            textureY: floorTexture.textureY,
            textureWidth: 20,
            textureHeight: 20,
            repeatWidth: floorTexture.textureWidth,
            repeatHeight: floorTexture.textureHeight,
        });

        const wallTexture = getTextureCoordinate(32, 64, 32, 32, 0, 0);
        this.serviceLocator.getRenderService().wallRenderService.createItem({
            startPos: [-10, -10],
            endPos: [10, -10],
            startHeight: 1,
            endHeight: 1,
            startOffset: 0,
            endOffset: 0,
            textureX: wallTexture.textureX,
            textureY: wallTexture.textureY,
            textureWidth: 20,
            textureHeight: wallTexture.textureHeight,
            repeatWidth: wallTexture.textureWidth,
            repeatHeight: wallTexture.textureHeight,
        });

        this.serviceLocator.getRenderService().wallRenderService.createItem({
            startPos: [10, -10],
            endPos: [10, 10],
            startHeight: 1,
            endHeight: 1,
            startOffset: 0,
            endOffset: 0,
            textureX: wallTexture.textureX,
            textureY: wallTexture.textureY,
            textureWidth: 20,
            textureHeight: wallTexture.textureHeight,
            repeatWidth: wallTexture.textureWidth,
            repeatHeight: wallTexture.textureHeight,
        });

        this.serviceLocator.getRenderService().wallRenderService.createItem({
            startPos: [10, 10],
            endPos: [-10, 10],
            startHeight: 1,
            endHeight: 1,
            startOffset: 0,
            endOffset: 0,
            textureX: wallTexture.textureX,
            textureY: wallTexture.textureY,
            textureWidth: 20,
            textureHeight: wallTexture.textureHeight,
            repeatWidth: wallTexture.textureWidth,
            repeatHeight: wallTexture.textureHeight,
        });

        this.serviceLocator.getRenderService().wallRenderService.createItem({
            startPos: [-10, 10],
            endPos: [-10, -10],
            startHeight: 1,
            endHeight: 1,
            startOffset: 0,
            endOffset: 0,
            textureX: wallTexture.textureX,
            textureY: wallTexture.textureY,
            textureWidth: 20,
            textureHeight: wallTexture.textureHeight,
            repeatWidth: wallTexture.textureWidth,
            repeatHeight: wallTexture.textureHeight,
        });
    }
}
