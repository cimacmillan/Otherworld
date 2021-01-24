import { Game } from "../../Game";
// import { Audios } from "../../resources/manifests/Types";
import { InputState } from "../../services/input/InputService";
import { ProcedureService } from "../../services/jobs/ProcedureService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Entity } from "../Entity";
import { Player } from "../player/Player";
import { bootstrap } from "./Bootstrap";

/**
 * Service for quick commands that usually take more lines, eg
 * GameScriptingService.getSpawner().spawnMacator();
 * GameScriptingService.getPlayer().damage();
 */
export class ScriptingService {
    private game: Game;
    private serviceLocator: ServiceLocator;

    private player: Player;
    private shouldReset: boolean = false;

    public constructor(game: Game) {
        this.game = game;
    }

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
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
        // this.serviceLocator
        //     .getAudioService()
        //     .play(
        //         this.serviceLocator.getResourceManager().manifest.audio[
        //             Audios.END
        //         ]
        //     );
        this.game.setUpdateWorld(false);
        this.serviceLocator.getInputService().setInputState(InputState.MENU);
        ProcedureService.setTimeout(() => this.resetContent(), 1000);
    }

    public startGame() {
        // this.serviceLocator
        //     .getAudioService()
        //     .play(
        //         this.serviceLocator.getResourceManager().manifest.audio[
        //             Audios.INCOMING
        //         ]
        //     );
        this.serviceLocator.getInputService().setInputState(InputState.DEFAULT);
        this.game.setUpdateWorld(true);
    }

    public bootsrapDeserialisedContent(
        player: Player,
        entity: Array<Entity<any>>
    ) {
        const world = this.serviceLocator.getWorld();
        const entityArray = world.getEntityArray();
        for (const entity of entityArray.getArray()) {
            world.removeEntity(entity);
        }
        world.performSync();

        this.player = player;
        // world.addEntity(this.player);

        this.serviceLocator
            .getAudioService()
            .attachCamera(() => this.player.getCamera());
        this.serviceLocator
            .getRenderService()
            .attachCamera(() => this.player.getCamera());

        this.serviceLocator.getTutorialService().onStart();

        // world.addEntity(player);
        for (let i = 1; i < entity.length; i++) {
            world.addEntity(entity[i]);
        }

        world.performSync();
    }

    public bootstrapInitialContent() {
        const bootstrapInfo = bootstrap(this.serviceLocator);
        this.player = bootstrapInfo.player;
        this.serviceLocator.getTutorialService().onStart();
    }
}
