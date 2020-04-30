import {
    RenderItem,
    Wall,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../State";

export interface WallState {
    wallState: {
        wall?: Wall;
    };
}

export type WallStateType = BaseState & WallState;

export class WallRenderComponent<
    T extends WallStateType
> extends EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public constructor(private initialWall?: Wall) {
        super();
    }

    public init(entity: Entity<WallStateType>): WallState {
        return this.initialWall
            ? {
                  wallState: {
                      wall: this.initialWall,
                  },
              }
            : {
                  wallState: {},
              };
    }

    public update(entity: Entity<WallStateType>): void {
        const { wall } = entity.getState().wallState;
        if (wall) {
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.updateItem(this.toRenderRef, wall);
        }
    }

    public onEvent(entity: Entity<WallStateType>, event: GameEvent): void {}

    public onObservedEvent(
        entity: Entity<WallStateType>,
        event: GameEvent
    ): void {}

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
        if (this.initialWall && !this.toRenderRef) {
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
