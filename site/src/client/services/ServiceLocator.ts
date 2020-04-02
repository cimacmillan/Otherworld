import { EventRouter } from "../engine/EventRouter";
import { World } from "../engine/World";
import { RenderService } from "../render";
import { ResourceManager } from "../resources/ResourceManager";
import { AudioService } from "../util/sound/AudioService";

export class ServiceLocator {
	public constructor(
		private resourceManager: ResourceManager,
		private world: World,
		private renderService: RenderService,
		private audioService: AudioService,
		private eventRouter: EventRouter
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
}
