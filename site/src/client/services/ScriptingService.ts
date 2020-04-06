import { CrabletLogicComponent } from "../engine/components/CrabletLogicComponent";
import { PhysicsComponent } from "../engine/components/PhysicsComponent";
import {
    PlayerControlComponent,
    PlayerState,
} from "../engine/components/player/PlayerControlComponent";
import { SpriteRenderComponent } from "../engine/components/SpriteRenderComponent";
import { Entity } from "../engine/Entity";
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

        this.player = new Entity<PlayerState>(
            this.serviceLocator,
            new PhysicsComponent(),
            new PlayerControlComponent({ x: 0, y: 2 }, 0)
        );
        world.addEntity(this.player);

        const camera = this.player.getState().camera;
        this.serviceLocator.getAudioService().attachCamera(camera);
        this.serviceLocator.getRenderService().attachCamera(camera);

        // for (let i = 0; i < 10; i++) {
        //     const sprite = new Entity(
        //         this.serviceLocator,
        //         new SpriteRenderComponent(),
        //         new SpriteLogicComponent()
        //     );
        //     world.addEntity(sprite);
        // }

        // for (let i = 0; i < 1000; i++) {
        //     const sprite = new Entity(
        //         this.serviceLocator,
        //         new SpriteRenderComponent(),
        //         new FlowerLogicComponent()
        //     );
        //     world.addEntity(sprite);
        // }

        for (let i = 0; i < 100; i++) {
            const sprite = new Entity(
                this.serviceLocator,
                new SpriteRenderComponent(),
                new CrabletLogicComponent(),
                new PhysicsComponent()
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
