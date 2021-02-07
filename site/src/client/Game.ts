import { HEIGHT, IS_DEV_MODE, TARGET_MILLIS, VERSION, WIDTH } from "./Config";
import { GameEvent, RootEventType } from "./engine/events/Event";
import { ScriptingService } from "./engine/scripting/ScriptingService";
import { TutorialService } from "./engine/scripting/TutorialService";
import { World } from "./engine/World";
import { ResourceManager } from "./resources/ResourceManager";
import { AudioService } from "./services/audio/AudioService";
import { EventRouter, GameEventSource } from "./services/EventRouter";
import { InputService, InputState } from "./services/input/InputService";
import { InteractionService } from "./services/interaction/InteractionService";
import { ProcedureService } from "./services/jobs/ProcedureService";
import { MapService } from "./services/map/MapService";
import { ParticleService } from "./services/particle/ParticleService";
import { PhysicsService } from "./services/physics/PhysicsService";
import { RenderService, ScreenBuffer } from "./services/render";
import { SerialisationListeners } from "./services/serialisation/Listeners";
import {
    SerialisationObject,
    SerialisationService,
} from "./services/serialisation/SerialisationService";
import { GameStorage } from "./services/serialisation/Storage";
import { ServiceLocator } from "./services/ServiceLocator";
import { Actions } from "./ui/actions/Actions";
import { GameStartActionType } from "./ui/actions/GameStartActions";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";

export class Game {
    private serviceLocator: ServiceLocator;
    private storage: GameStorage;
    private uiListener: (event: Actions) => void;

    private initialised: boolean = false;
    private updateWorld: boolean = false;
    private isHidden: boolean = false;

    public async init(
        openGL: WebGLRenderingContext,
        uiListener: (event: Actions) => void
    ) {
        this.uiListener = uiListener;

        const audioContext = new AudioContext();
        const screen = new ScreenBuffer(openGL, WIDTH, HEIGHT);

        const resourceManager = new ResourceManager();
        await resourceManager.load(openGL, audioContext, uiListener);

        const router = new EventRouter();
        router.attachEventListener(GameEventSource.UI, uiListener);

        const world = new World((event: GameEvent) =>
            router.routeEvent(GameEventSource.WORLD, event)
        );
        router.attachEventListener(GameEventSource.WORLD, (event: GameEvent) =>
            world.emitIntoWorld(event)
        );

        const scriptingService = new ScriptingService(this);

        const inputService = new InputService();

        const interactionService = new InteractionService();

        const serialisationService = new SerialisationService();

        const tutorialService = new TutorialService();

        const mapService = new MapService();

        this.serviceLocator = new ServiceLocator(
            this,
            resourceManager,
            world,
            new RenderService(resourceManager),
            new AudioService(audioContext),
            router,
            scriptingService,
            inputService,
            new PhysicsService(),
            interactionService,
            serialisationService,
            tutorialService,
            new ParticleService(),
            mapService
        );

        this.serviceLocator.getSerialisationService().init(this.serviceLocator);
        this.serviceLocator.getInputService().init(this.serviceLocator);
        this.serviceLocator.getRenderService().init(screen.getOpenGL());
        this.serviceLocator.getWorld().init();
        this.serviceLocator.getTutorialService().init(this.serviceLocator);
        this.serviceLocator.getParticleService().init(this.serviceLocator);
        this.serviceLocator.getScriptingService().init(this.serviceLocator);
        this.serviceLocator.getMapService().init(this.serviceLocator);

        this.storage = new GameStorage();

        let compatibleSave: SerialisationObject | undefined;

        const newGame = () => {
            this.serviceLocator.getScriptingService().bootstrapInitialContent();
        };

        try {
            if (this.storage.isSaveAvailable()) {
                const save = this.storage.getSaveGame();
                compatibleSave = save;

                if (save.version !== VERSION) {
                    compatibleSave = undefined;
                    console.log(
                        "save version incompatible ",
                        save.version,
                        VERSION
                    );
                }

                if (IS_DEV_MODE()) {
                    compatibleSave = undefined;
                    console.log("not loading save, in dev mode");
                }
            }

            // TODO remove this
            compatibleSave = undefined;
            console.log("save games disabled");

            if (compatibleSave) {
                console.log("Loading save game...", compatibleSave);
                this.serviceLocator
                    .getSerialisationService()
                    .deserialise(compatibleSave);
                this.setUpdateWorld(true);
                this.serviceLocator
                    .getInputService()
                    .setInputState(InputState.DEFAULT);
                console.log("Successfully loaded save game...", compatibleSave);
            } else {
                newGame();
            }
        } catch (e) {
            console.log("Error loading save game: ", e);
            newGame();
        }

        SerialisationListeners.attachWindowExitListener(
            this.serviceLocator,
            this.storage
        );

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

    public setIsHidden(isHidden: boolean) {
        this.isHidden = isHidden;
    }

    private update = () => {
        this.serviceLocator.getScriptingService().update();
        this.serviceLocator.getWorld().performSync();
        ProcedureService.update();
        if (this.updateWorld && !this.isHidden) {
            this.serviceLocator.getScriptingService().getPlayer().update();
            this.serviceLocator.getInputService().update();
            this.serviceLocator.getWorld().update();
            this.serviceLocator.getPhysicsService().update();
            this.serviceLocator.getInteractionService().update();
            this.serviceLocator.getParticleService().update();
            ProcedureService.gameUpdate();
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
            const result = ProcedureService.getPendingTimerCounts();
            console.log(
                `FPS: ${fps} BudgetUsage: ${Math.floor(
                    budgetUsage * 100
                )}% EntityCount: ${
                    this.serviceLocator.getWorld().getEntityArray().getArray()
                        .length
                } Intervals ${result.intervals} Timeouts ${result.timeouts}
                Particles ${
                    this.serviceLocator.getParticleService().getParticles()
                        .length
                }
                `
            );
            this.uiListener &&
                this.uiListener({
                    type: GameStartActionType.SET_GAME_FPS,
                    fps,
                });
        });
        setFPSProportion(1 / actualProportion);

        this.update();
        this.draw();
    };
}
