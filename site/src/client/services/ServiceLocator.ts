import { RenderService } from "../render";
import { World } from "../engine/World";

export class ServiceLocator {
  public constructor(
    private world: World,
    private renderService: RenderService
  ) {}

  public getWorld() {
    return this.world;
  }

  public getRenderService() {
    return this.renderService;
  }
}
