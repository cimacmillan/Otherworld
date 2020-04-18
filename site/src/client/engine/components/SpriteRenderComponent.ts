import {
    RenderItem,
    Sprite,
} from "../../services/render/types/RenderInterface";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState } from "../State";

export interface SpriteState {
    toRender?: Sprite;
}

export type SpriteStateType = BaseState & SpriteState;

export class SpriteRenderComponent<
    T extends SpriteStateType
> extends EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public init(entity: Entity<SpriteStateType>) {
        return {};
    }

    public update(entity: Entity<SpriteStateType>): void {
        const { toRender } = entity.getState();
        if (toRender) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.updateItem(this.toRenderRef, toRender);
        }
    }

    public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {}

    public onObservedEvent(
        entity: Entity<SpriteStateType>,
        event: GameEvent
    ): void {}

    public onStateTransition(
        entity: Entity<SpriteStateType>,
        from: SpriteState,
        to: SpriteState
    ) {
        if (!from.toRender && to.toRender) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(to.toRender);
        } else if (from.toRender && !to.toRender && this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    public onCreate(entity: Entity<SpriteStateType>): void {}

    public onDestroy(entity: Entity<SpriteStateType>) {
        if (this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }
}
