import {
    RenderItem,
    Sprite,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../state/State";

export interface SpriteState {
    spriteState: {
        sprite?: Sprite;
    };
}

export type SpriteStateType = BaseState & SpriteState;

export class SpriteRenderComponent<T extends SpriteStateType>
    implements EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public update(entity: Entity<SpriteStateType>): void {
        const { sprite } = entity.getState().spriteState;
        if (sprite) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.updateItem(this.toRenderRef, sprite);
        }
    }

    public onObservedEvent(
        entity: Entity<SpriteStateType>,
        event: GameEvent
    ): void {}

    public onStateTransition(
        entity: Entity<SpriteStateType>,
        from: SpriteState,
        to: SpriteState
    ) {
        if (!from.spriteState.sprite && to.spriteState.sprite) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(to.spriteState.sprite);
        } else if (
            from.spriteState.sprite &&
            !to.spriteState.sprite &&
            this.toRenderRef
        ) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    public onCreate(entity: Entity<SpriteStateType>): void {
        if (entity.getState().spriteState.sprite) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(
                    entity.getState().spriteState.sprite
                );
        }
    }

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
