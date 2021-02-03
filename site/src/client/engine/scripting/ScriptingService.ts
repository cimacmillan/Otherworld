import { Game } from "../../Game";
// import { Audios } from "../../resources/manifests/Types";
import { InputState } from "../../services/input/InputService";
import { DeserialisedObject } from "../../services/serialisation/SerialisationService";
import { ServiceLocator } from "../../services/ServiceLocator";
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

    public update() {}

    public startGame() {
        this.serviceLocator.getInputService().setInputState(InputState.DEFAULT);
        this.game.setUpdateWorld(true);
    }

    public offloadWorld() {
        const world = this.serviceLocator.getWorld();
        const entityArray = world.getEntityArray();
        for (const entity of entityArray.getArray()) {
            world.removeEntity(entity);
        }
        world.performSync();
        if (this.player) {
            this.player.destroy();
        }
        this.serviceLocator.getTutorialService().destroy();
    }

    public bootsrapDeserialisedContent(args: DeserialisedObject) {
        const { entities, player } = args.world;
        const { tutorial } = args.services;

        this.offloadWorld();
        const world = this.serviceLocator.getWorld();
        this.player = player;
        // world.addEntity(this.player);

        this.serviceLocator
            .getAudioService()
            .attachCamera(() => this.player.getCamera());
        this.serviceLocator
            .getRenderService()
            .attachCamera(() => this.player.getCamera());

        this.serviceLocator.getTutorialService().onStart(tutorial);

        entities.forEach((entity) => world.addEntity(entity));

        world.performSync();
    }

    public bootstrapInitialContent() {
        const bootstrapInfo = bootstrap(this.serviceLocator);
        this.player = bootstrapInfo.player;
        this.serviceLocator.getTutorialService().onStart();
    }
}
