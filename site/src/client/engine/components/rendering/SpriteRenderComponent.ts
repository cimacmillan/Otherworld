import {
    RenderItem,
    Sprite,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent, EntityComponentType } from "../../EntityComponent";
import {
    BaseState,
    SpriteRenderState,
    SurfacePositionState,
} from "../../state/State";

export type SpriteStateType = BaseState &
    SurfacePositionState &
    SpriteRenderState;

export class SpriteRenderComponent<T extends SpriteStateType>
    implements EntityComponent<T> {
    public componentType = EntityComponentType.SpriteRenderComponent;

    private toRenderRef?: RenderItem;
    private sprite: Sprite;

    public update(entity: Entity<SpriteStateType>): void {
        const state = entity.getState();
        this.sprite = this.getSpriteFromState(state);

        if (state.shouldRender) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.updateItem(this.toRenderRef, this.sprite);
        }
    }

    public onStateTransition(
        entity: Entity<SpriteStateType>,
        from: SpriteStateType,
        to: SpriteStateType
    ) {
        if (!from.shouldRender && to.shouldRender) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(
                    this.getSpriteFromState(entity.getState())
                );
        } else if (from.shouldRender && !to.shouldRender && this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    public onCreate(entity: Entity<SpriteStateType>): void {
        if (entity.getState().shouldRender) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(
                    this.getSpriteFromState(entity.getState())
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

    private getSpriteFromState(state: SpriteStateType): Sprite {
        return {
            position: [state.position.x, state.position.y],
            size: [state.spriteWidth, state.spriteHeight],
            height: state.height,
            texture: state.textureCoordinate,
        };
    }
}
