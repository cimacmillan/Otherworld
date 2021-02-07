import { Game } from "../../Game";
import { Maps } from "../../resources/manifests/Maps";
// import { Audios } from "../../resources/manifests/Types";
import { InputState } from "../../services/input/InputService";
import { DeserialisedObject } from "../../services/serialisation/SerialisationService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Player } from "../player/Player";
import { createPlayer } from "./factory/PlayerFactory";

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
        this.offloadEntities();
        if (this.player) {
            this.player.destroy();
        }
        this.serviceLocator.getTutorialService().destroy();
    }

    public offloadEntities() {
        const world = this.serviceLocator.getWorld();
        const entityArray = world.getEntityArray();
        for (const entity of entityArray.getArray()) {
            world.removeEntity(entity);
        }
        world.performSync();
    }

    public bootsrapDeserialisedContent(args: DeserialisedObject) {
        const { maps, player, currentMap } = args.world;
        const { tutorial } = args.services;
        const entities = maps[currentMap].entities;

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
        this.serviceLocator
            .getMapService()
            .setExistingMapData(maps, currentMap as Maps);

        this.serviceLocator.getTutorialService().onStart(tutorial);

        entities.forEach((entity) => world.addEntity(entity));

        world.performSync();
    }

    public bootstrapInitialContent() {
        this.player = createPlayer(this.serviceLocator);
        this.serviceLocator
            .getAudioService()
            .attachCamera(() => this.player.getCamera());
        this.serviceLocator
            .getRenderService()
            .attachCamera(() => this.player.getCamera());

        this.serviceLocator.getMapService().goToMap({
            mapId: Maps.PRISON,
            // destination: { x: 31.5, y: 31.5, angle: 0}
        });

        this.serviceLocator.getTutorialService().onStart();
    }
}
