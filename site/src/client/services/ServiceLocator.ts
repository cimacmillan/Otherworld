import { ScriptingService } from "../engine/scripting/ScriptingService";
import { TutorialService } from "../engine/scripting/TutorialService";
import { World } from "../engine/World";
import { Game } from "../Game";
import { ResourceManager } from "../resources/ResourceManager";
import { AudioService } from "./audio/AudioService";
import { EventRouter } from "./EventRouter";
import { InputService } from "./input/InputService";
import { InteractionService } from "./interaction/InteractionService";
import { PhysicsService } from "./physics/PhysicsService";
import { RenderService } from "./render";
import { SerialisationService } from "./serialisation/SerialisationService";

export class ServiceLocator {
    public constructor(
        private game: Game,
        private resourceManager: ResourceManager,
        private world: World,
        private renderService: RenderService,
        private audioService: AudioService,
        private eventRouter: EventRouter,
        private scriptingService: ScriptingService,
        private inputService: InputService,
        private physicsService: PhysicsService,
        private interactionService: InteractionService,
        private serialisationService: SerialisationService,
        private tutorialService: TutorialService
    ) {}

    public getGame() {
        return this.game;
    }

    public getResourceManager() {
        return this.resourceManager;
    }

    public getWorld() {
        return this.world;
    }

    public getRenderService() {
        return this.renderService;
    }

    public getAudioService() {
        return this.audioService;
    }

    public getEventRouter() {
        return this.eventRouter;
    }

    public getScriptingService() {
        return this.scriptingService;
    }

    public getInputService() {
        return this.inputService;
    }

    public getPhysicsService() {
        return this.physicsService;
    }

    public getInteractionService() {
        return this.interactionService;
    }

    public getSerialisationService() {
        return this.serialisationService;
    }

    public getTutorialService() {
        return this.tutorialService;
    }
}
