import { Sprites } from "../../../resources/manifests/Sprites";
import {
    RenderItem,
    Wall,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { createWallType } from "../../scripting/factory/SceneryFactory";

export interface WallState {
    wallState: {
        wall?: Wall;
    };
}

export type WallStateType = WallState;

export class WallRenderComponent implements EntityComponent<WallStateType> {
    private toRenderRef?: RenderItem;

    public getInitialState = (entity: Entity<WallStateType>): WallStateType => {
        const wall = createWallType(
            entity.getServiceLocator(),
            Sprites.SLIME,
            {
                x: 0,
                y: 0,
            },
            {
                x: 1,
                y: 0,
            },
            1,
            1
        );
        return {
            wallState: {
                wall,
            },
        };
    };

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
