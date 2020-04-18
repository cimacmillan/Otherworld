import { PlayerState } from "../../engine/components/player/PlayerControlComponent";
import { Entity } from "../../engine/Entity";
import { getTextureCoordinate } from "../../util/math";
import { ServiceLocator } from "../ServiceLocator";
import { createMacator } from "./factory/EntityFactory";
import { createPlayer } from "./factory/PlayerFactory";
import { createWall } from "./factory/WallFactory";

/**
 * Service for quick commands that usually take more lines, eg
 * GameScriptingService.getSpawner().spawnMacator();
 * GameScriptingService.getPlayer().damage();
 */
export class ScriptingService {
    private serviceLocator: ServiceLocator;
    private player: Entity<PlayerState>;
    private shouldReset: boolean = false;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.bootstrapContent();
    }

    public getPlayer() {
        return this.player;
    }

    public resetContent() {
        this.shouldReset = true;
    }

    public update() {
        if (this.shouldReset) {
            this.shouldReset = false;
            const world = this.serviceLocator.getWorld();
            const entityArray = world.getEntityArray();
            for (const entity of entityArray.getArray()) {
                world.removeEntity(entity);
            }
            this.bootstrapContent();
        }
    }

    private bootstrapContent() {
        const world = this.serviceLocator.getWorld();

        this.player = createPlayer(this.serviceLocator);
        world.addEntity(this.player);

        const camera = this.player.getState().camera;
        this.serviceLocator.getAudioService().attachCamera(camera);
        this.serviceLocator.getRenderService().attachCamera(camera);

        for (let i = 0; i < 100; i++) {
            world.addEntity(createMacator(this.serviceLocator));
        }

        // Walls and floors not getting deleted
        const floorTexture = getTextureCoordinate(32, 64, 32, 32, 0, 32);
        this.serviceLocator.getRenderService().floorRenderService.createItem({
            startPos: [-50, -50],
            endPos: [50, 50],
            height: 0,
            textureX: floorTexture.textureX,
            textureY: floorTexture.textureY,
            textureWidth: 100,
            textureHeight: 100,
            repeatWidth: floorTexture.textureWidth,
            repeatHeight: floorTexture.textureHeight,
        });

        createWall(this.serviceLocator, { x: -10, y: -10 }, { x: 10, y: -10 });
        createWall(this.serviceLocator, { x: -10, y: -10 }, { x: -10, y: 10 });
        createWall(this.serviceLocator, { x: 10, y: -10 }, { x: 10, y: 10 });

        createWall(this.serviceLocator, { x: -10, y: 10 }, { x: -0.5, y: 20 });
        createWall(this.serviceLocator, { x: 10, y: 10 }, { x: 0.5, y: 20 });

        createWall(this.serviceLocator, { x: -0.5, y: 20 }, { x: -0.5, y: 30 });
        createWall(this.serviceLocator, { x: 0.5, y: 20 }, { x: 0.5, y: 30 });
    }
}
