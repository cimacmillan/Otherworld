import { HEIGHT, TARGET_MILLIS, WIDTH } from "./Config";
import { GameEvent } from "./engine/events/Event";
import { World } from "./engine/World";
import { initialiseInput, updateInput } from "./Input";
import { RenderService, ScreenBuffer } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { EventRouter, GameEventSource } from "./services/EventRouter";
import { ScriptingService } from "./services/ScriptingService";
import { ServiceLocator } from "./services/ServiceLocator";
import { GameState } from "./state/GameState";
import { initialiseCamera } from "./util/loader/MapLoader";
import { AudioService } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";

export class Game {
    private gameState: GameState;
    private serviceLocator: ServiceLocator;
    private initialised: boolean = false;
    private updateWorld: boolean = true;

    public async init(
        openGL: WebGLRenderingContext,
        uiListener: (event: GameEvent) => void
    ) {
        const audioContext = new AudioContext();

        const resourceManager = new ResourceManager();
        await resourceManager.load(openGL, audioContext);

        const router = new EventRouter();
        router.attachEventListener(GameEventSource.UI, uiListener);

        const world = new World((event: GameEvent) =>
            router.routeEvent(GameEventSource.WORLD, event)
        );
        router.attachEventListener(GameEventSource.WORLD, (event: GameEvent) =>
            world.emitIntoWorld(event)
        );

        const scriptingService = new ScriptingService();

        this.serviceLocator = new ServiceLocator(
            resourceManager,
            world,
            new RenderService(resourceManager),
            new AudioService(audioContext),
            router,
            scriptingService
        );

        initialiseInput();

        const screen = new ScreenBuffer(openGL, WIDTH, HEIGHT);

        const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);

        this.gameState = {
            loop,
            render: {
                screen,
                camera: initialiseCamera(screen),
            },
        };

        this.serviceLocator
            .getAudioService()
            .attachCamera(this.gameState.render.camera);
        this.serviceLocator.getRenderService().init(this.gameState.render);
        this.serviceLocator.getWorld().init();
        this.serviceLocator.getScriptingService().init(this.serviceLocator);

        // this.serviceLocator.getAudioService().play(this.serviceLocator.getResourceManager().intro);

        this.gameState.loop.start();

        this.initialised = true;
    }

    public isInitialised() {
        return this.initialised;
    }

    public getServiceLocator() {
        return this.serviceLocator;
    }

    public setUpdateWorld(updateWorld: boolean) {
        this.updateWorld = updateWorld;
    }

    private update = () => {
        updateInput(this.gameState.render.camera);
        if (this.updateWorld) {
            this.serviceLocator.getWorld().update();
        }
    };

    private draw = () => {
        this.serviceLocator.getRenderService().draw(this.gameState.render);
    };

    private mainLoop = (
        instance: TimeControlledLoop,
        actualMilliseconds: number,
        actualProportion?: number
    ) => {
        logFPS((fps) => {
            console.log(
                `FPS: ${fps} EntityCount: ${
                    this.serviceLocator.getWorld().getEntityArray().getArray()
                        .length
                }`
            );
        });
        setFPSProportion(1 / actualProportion);

        this.update();
        this.draw();
    };
}
