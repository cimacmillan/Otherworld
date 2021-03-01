import { Actions } from "../Actions";
import { ScriptingService } from "../engine/scripting/ScriptingService";
import { TutorialService } from "../engine/scripting/TutorialService";
import { World } from "../engine/World";
import { Game } from "../Game";
import { ResourceManager } from "../resources/ResourceManager";
import { State } from "../ui/State";
import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { Store } from "../util/engine/Store";
import { AudioService } from "./audio/AudioService";
import { InputService } from "./input/InputService";
import { InteractionService } from "./interaction/InteractionService";
import { MapService } from "./map/MapService";
import { ParticleService } from "./particle/ParticleService";
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
        private store: Store<State, Actions>,
        private scriptingService: ScriptingService,
        private inputService: InputService,
        private physicsService: PhysicsService,
        private interactionService: InteractionService,
        private serialisationService: SerialisationService,
        private tutorialService: TutorialService,
        private particleService: ParticleService,
        private mapService: MapService
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

    public getStore() {
        return this.store;
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

    public getParticleService() {
        return this.particleService;
    }

    public getMapService() {
        return this.mapService;
    }
}
