import { RenderService } from "../render";
import { World } from "../engine/World";
import { AudioService } from "../util/sound/AudioService";
import { ResourceManager } from "../resources/ResourceManager";
import { GameState } from "../state/GameState";

export class ServiceLocator {
  public constructor(
    private resourceManager: ResourceManager,
    private world: World,
    private renderService: RenderService,
    private audioService: AudioService
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
}
