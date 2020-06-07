import { Entity } from "../../engine/Entity";
import { BaseState } from "../../engine/state/State";
import { Game } from "../../Game";
import { Audios, MAPS } from "../../resources/manifests/Types";
import { loadMap } from "../../resources/MapLoader";
import { InputState } from "../input/InputService";
import { ServiceLocator } from "../ServiceLocator";
import { createEgg } from "./factory/EnemyFactory";
import { createPlayer, PlayerState } from "./factory/PlayerFactory";
import { InventoryService } from "./items/InventoryService";

/**
 * Service for quick commands that usually take more lines, eg
 * GameScriptingService.getSpawner().spawnMacator();
 * GameScriptingService.getPlayer().damage();
 */
export class ScriptingService {
    public inventoryService: InventoryService;

    private game: Game;
    private serviceLocator: ServiceLocator;

    private player: Entity<PlayerState>;
    private shouldReset: boolean = false;

    public constructor(game: Game) {
        this.game = game;
    }

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.inventoryService = new InventoryService(serviceLocator);
        this.bootstrapInitialContent();
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
            this.bootstrapInitialContent();
        }
    }

    public endGame() {
        this.serviceLocator
            .getAudioService()
            .play(
                this.serviceLocator.getResourceManager().manifest.audio[
                    Audios.END
                ]
            );
        this.game.setUpdateWorld(false);
        this.serviceLocator.getInputService().setInputState(InputState.MENU);
        this.resetContent();
    }

    public startGame() {
        this.serviceLocator
            .getAudioService()
            .play(
                this.serviceLocator.getResourceManager().manifest.audio[
                    Audios.INCOMING
                ]
            );
        this.serviceLocator.getInputService().setInputState(InputState.DEFAULT);

        this.game.setUpdateWorld(true);
    }

    public bootsrapDeserialisedContent(entity: Array<Entity<BaseState>>) {
        const world = this.serviceLocator.getWorld();
        const entityArray = world.getEntityArray();
        for (const entity of entityArray.getArray()) {
            world.removeEntity(entity);
        }
        world.performSync();

        this.player = entity[0] as Entity<PlayerState>;
        world.addEntity(this.player);

        const camera = this.player.getState().camera;
        this.serviceLocator.getAudioService().attachCamera(camera);
        this.serviceLocator.getRenderService().attachCamera(camera);

        for (let i = 1; i < entity.length; i++) {
            world.addEntity(entity[i]);
        }
        world.performSync();
    }

    private bootstrapInitialContent() {
        const world = this.serviceLocator.getWorld();

        this.player = createPlayer(this.serviceLocator);
        world.addEntity(this.player);

        const camera = this.player.getState().camera;
        this.serviceLocator.getAudioService().attachCamera(camera);
        this.serviceLocator.getRenderService().attachCamera(camera);

        world.addEntity(createEgg(this.serviceLocator));

        loadMap(
            this.serviceLocator,
            this.serviceLocator.getResourceManager().manifest.maps[MAPS.DEFAULT]
        );
    }
}
