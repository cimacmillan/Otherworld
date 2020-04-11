import { HEIGHT, TARGET_MILLIS, WIDTH } from "./Config";
import { GameEvent, RootEventType } from "./engine/events/Event";
import { World } from "./engine/World";
import { EventRouter, GameEventSource } from "./services/EventRouter";
import { InputService } from "./services/input/InputService";
import { PhysicsService } from "./services/physics/PhysicsService";
import { RenderService, ScreenBuffer } from "./services/render";
import { ResourceManager } from "./services/resources/ResourceManager";
import { ScriptingService } from "./services/scripting/ScriptingService";
import { ServiceLocator } from "./services/ServiceLocator";
import { AudioService } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";
import { InteractionService } from "./services/interaction/InteractionService";

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
        
        const interactionService = new InteractionService();

        this.serviceLocator = new ServiceLocator(
            resourceManager,
            world,
            new RenderService(resourceManager),
            new AudioService(audioContext),
            router,
            scriptingService,
            inputService,
            new PhysicsService(),
            interactionService
        );

        this.serviceLocator.getInputService().init(this.serviceLocator);
        this.serviceLocator.getRenderService().init(screen.getOpenGL());
        this.serviceLocator.getWorld().init();

        this.serviceLocator.getScriptingService().init(this.serviceLocator);

        const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);
        this.initialised = true;
        this.serviceLocator.getEventRouter().routeEvent(GameEventSource.ROOT, {
            type: RootEventType.GAME_INITIALISED,
        });

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
            this.serviceLocator.getPhysicsService().update();
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
