import { HEIGHT, TARGET_MILLIS, WIDTH } from "./Config";
import { GameEvent } from "./engine/events/Event";
import { World } from "./engine/World";
import { RenderService, ScreenBuffer } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { EventRouter, GameEventSource } from "./services/EventRouter";
import { InputService } from "./services/InputService";
import { ScriptingService } from "./services/ScriptingService";
import { ServiceLocator } from "./services/ServiceLocator";
import { AudioService } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";

export class Game {
    private serviceLocator: ServiceLocator;

    private initialised: boolean = false;
    private updateWorld: boolean = true;

    public async init(
        openGL: WebGLRenderingContext,
        uiListener: (event: GameEvent) => void
    ) {
        const audioContext = new AudioContext();
        const screen = new ScreenBuffer(openGL, WIDTH, HEIGHT);

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

        const inputService = new InputService();

        this.serviceLocator = new ServiceLocator(
            resourceManager,
            world,
            new RenderService(resourceManager),
            new AudioService(audioContext),
            router,
            scriptingService,
            inputService
        );

        this.serviceLocator.getInputService().init(this.serviceLocator);
        this.serviceLocator.getRenderService().init(screen.getOpenGL());
        this.serviceLocator.getWorld().init();

        this.serviceLocator.getScriptingService().init(this.serviceLocator);

        const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);
        this.initialised = true;
        loop.start();
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
        this.serviceLocator.getInputService().update();
        if (this.updateWorld) {
            this.serviceLocator.getWorld().update();
        }
    };

    private draw = () => {
        this.serviceLocator.getRenderService().draw();
    };

    private mainLoop = (
        instance: TimeControlledLoop,
        actualMilliseconds: number,
        actualProportion: number,
        budgetUsage: number
    ) => {
        logFPS((fps) => {
            console.log(
                `FPS: ${fps} BudgetUsage: ${Math.floor(
                    budgetUsage * 100
                )}% EntityCount: ${
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
