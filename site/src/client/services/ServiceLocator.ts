import { World } from "../engine/World";
import { AudioService } from "../util/sound/AudioService";
import { EventRouter } from "./EventRouter";
import { InputService } from "./InputService";
import { PhysicsService } from "./physics/PhysicsService";
import { RenderService } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { ScriptingService } from "./ScriptingService";

export class ServiceLocator {
    public constructor(
        private resourceManager: ResourceManager,
        private world: World,
        private renderService: RenderService,
        private audioService: AudioService,
        private eventRouter: EventRouter,
        private scriptingService: ScriptingService,
        private inputService: InputService,
        private physicsService: PhysicsService
    ) {}

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
}
