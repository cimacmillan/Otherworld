import {
    RenderItem,
    Wall,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState } from "../../state/State";

export interface WallState {
    wallState: {
        wall?: Wall;
    };
}

export type WallStateType = BaseState & WallState;

export class WallRenderComponent<T extends WallStateType>
    implements EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public update(entity: Entity<WallStateType>): void {
        const { wall } = entity.getState().wallState;
        if (wall) {
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.updateItem(this.toRenderRef, wall);
        }
    }

    public onStateTransition(
        entity: Entity<WallStateType>,
        from: WallStateType,
        to: WallStateType
    ) {
        if (!from.wallState.wall && to.wallState.wall) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.createItem(to.wallState.wall);
        } else if (
            from.wallState.wall &&
            !to.wallState.wall &&
            this.toRenderRef
        ) {
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    public onCreate(entity: Entity<WallStateType>): void {
        if (entity.getState().wallState.wall) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.createItem(entity.getState().wallState.wall);
        }
    }

    public onDestroy(entity: Entity<WallStateType>) {
        if (this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }
}