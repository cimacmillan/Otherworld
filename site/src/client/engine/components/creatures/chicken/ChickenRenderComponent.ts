import {
    SpriteSheets,
} from "../../../../resources/manifests/Types";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { BaseState, SpriteRenderState } from "../../../state/State";
import { ChickenState } from "./ChickenState";

type ChickenRenderState = BaseState & ChickenState & SpriteRenderState;

export class ChickenRenderComponent<T extends ChickenRenderState>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.MacatorRenderComponent;

    public init(entity: Entity<ChickenRenderState>): void {
        const { logicState } = entity.getState();
        const resourceManager = entity.getServiceLocator().getResourceManager();
        const spritesheet =
            resourceManager.manifest.spritesheets[SpriteSheets.SPRITE];
    }
}
