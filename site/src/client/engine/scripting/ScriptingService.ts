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

    public stopGame() {
        const beatenGame = this.serviceLocator.getScriptingService().getPlayer().getMutableState().beatenGame;
        this.serviceLocator.getInputService().setInputState(InputState.MENU);
        this.game.setUpdateWorld(false);
        this.serviceLocator.getStore().getActions().stopGame();

        setTimeout(() => {
            this.offloadWorld();
            this.bootstrapInitialContent(beatenGame);
        }, 1000);
    }

    public onBeatGame() {
        this.serviceLocator.getInputService().setInputState(InputState.MENU);
        this.game.setUpdateWorld(false);
        const player = this.serviceLocator.getScriptingService().getPlayer();
        player.getMutableState().beatenGame = true;
        this.serviceLocator.getStore().getActions().onBeatGame();

        setTimeout(() => {
            this.offloadWorld();
            this.bootstrapInitialContent(true);
        }, 1000);
    }

    public offloadWorld() {
        this.offloadEntities();
        if (this.player) {
            this.player.destroy();
        }
        this.serviceLocator.getTutorialService().destroy();
        this.serviceLocator.getMapService().destroy();
    }

    public offloadEntities() {
        const world = this.serviceLocator.getWorld();
        const entityArray = world.getEntityArray();
        for (const entity of entityArray.getArray()) {
            world.removeEntity(entity);
        }
        world.performSync();
        this.serviceLocator.getParticleService().destroy();
    }

    public bootsrapDeserialisedContent(args: DeserialisedObject) {
        const { maps, player, currentMap } = args.world;
        const { tutorial } = args.services;
        const entities = maps[currentMap].entities;

        this.offloadWorld();
        const world = this.serviceLocator.getWorld();
        this.player = player;
        this.player.init();
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

        this.serviceLocator.getStore().getActions().onMaxStageReached(args.maxStage);
    }

    public bootstrapInitialContent(beatenGame: boolean) {
        this.player = createPlayer(this.serviceLocator, beatenGame);
        this.player.init();
        this.serviceLocator
            .getAudioService()
            .attachCamera(() => this.player.getCamera());
        this.serviceLocator
            .getRenderService()
            .attachCamera(() => this.player.getCamera());

        this.serviceLocator.getMapService().goToLocation({
            mapId: Maps.PRISON,
        });

        this.serviceLocator.getTutorialService().onStart();
    }
}
