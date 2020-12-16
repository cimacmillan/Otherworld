import {
    RenderItem,
    Wall,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export interface WallState {
    wallState: {
        wall?: Wall;
    };
}

export type WallStateType = WallState;

export class WallRenderComponent<T extends WallStateType>
    implements EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public onStateTransition(
        entity: Entity<WallStateType>,
        from: WallStateType,
        to: WallStateType
    ) {
        if (from.wallState.wall !== to.wallState.wall) {
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.updateItem(
                    this.toRenderRef,
                    to.wallState.wall
                );
        }
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
