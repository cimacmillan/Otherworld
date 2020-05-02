import { PlayerState } from "../../engine/components/player/PlayerControlComponent";
import { Entity } from "../../engine/Entity";
import { Game } from "../../Game";
import { Audios, SCENERYSPRITES } from "../resources/manifests/Types";
import { ServiceLocator } from "../ServiceLocator";
import { createEgg } from "./factory/EntityFactory";
import { createPlayer } from "./factory/PlayerFactory";
import { createStaticFloor, createStaticWall } from "./factory/SceneryFactory";

/**
 * Service for quick commands that usually take more lines, eg
 * GameScriptingService.getSpawner().spawnMacator();
 * GameScriptingService.getPlayer().damage();
 */
export class ScriptingService {
    private game: Game;
    private serviceLocator: ServiceLocator;
    private player: Entity<PlayerState>;
    private shouldReset: boolean = false;

    public constructor(game: Game) {
        this.game = game;
    }

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

    public endGame() {
        this.serviceLocator
            .getAudioService()
            .play(
                this.serviceLocator.getResourceManager().manifest.audio[
                    Audios.END
                ]
            );
        this.game.setUpdateWorld(false);
    }

    public startGame() {
        this.resetContent();
        this.game.setUpdateWorld(true);
    }

    private bootstrapContent() {
        const world = this.serviceLocator.getWorld();

        this.player = createPlayer(this.serviceLocator);
        world.addEntity(this.player);

        const camera = this.player.getState().camera;
        this.serviceLocator.getAudioService().attachCamera(camera);
        this.serviceLocator.getRenderService().attachCamera(camera);

        // for (let i = 0; i < 50; i++) {
        //     world.addEntity(createMacator(this.serviceLocator, Math.random(), Math.random()));
        // }

        world.addEntity(createEgg(this.serviceLocator));

        world.addEntity(
            createStaticFloor(
                this.serviceLocator,
                SCENERYSPRITES.FLOOR,
                0,
                { x: -50, y: -50 },
                { x: 50, y: 50 }
            )
        );

        world.addEntity(
            createStaticFloor(
                this.serviceLocator,
                SCENERYSPRITES.FLOOR,
                2,
                { x: -50, y: -50 },
                { x: 50, y: 50 }
            )
        );

        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: -10, y: -10 },
                { x: 10, y: -10 },
                2
            )
        );
        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: -10, y: -10 },
                { x: -10, y: 10 },
                2
            )
        );
        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: 10, y: -10 },
                { x: 10, y: 10 },
                2
            )
        );

        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: -10, y: 10 },
                { x: -0.5, y: 20 },
                2
            )
        );
        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: 10, y: 10 },
                { x: 0.5, y: 20 },
                2
            )
        );

        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: -0.5, y: 20 },
                { x: -0.5, y: 30 },
                2
            )
        );
        world.addEntity(
            createStaticWall(
                this.serviceLocator,
                SCENERYSPRITES.WALL,
                { x: 0.5, y: 20 },
                { x: 0.5, y: 30 },
                2
            )
        );
    }
}
