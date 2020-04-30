import { PhysicsBoundary } from "../../../services/physics/PhysicsService";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../State";

export interface BoundaryState {
    boundaryState: {
        boundary: PhysicsBoundary;
        collides: boolean;
    };
}

export type BoundaryStateType = BaseState & BoundaryState;

export class BoundaryComponent<
    T extends BoundaryStateType
> extends EntityComponent<T> {
    public constructor(private initialState?: BoundaryState) {
        super();
    }

    public init(entity: Entity<BoundaryStateType>) {
        return this.initialState || {};
    }

    public update(entity: Entity<BoundaryStateType>): void {}

    public onEvent(entity: Entity<BoundaryStateType>, event: GameEvent): void {}

    public onObservedEvent(
        entity: Entity<BoundaryStateType>,
        event: GameEvent
    ): void {}

    public onCreate(entity: Entity<BoundaryStateType>) {
        const { boundary, collides } = entity.getState().boundaryState;
        if (collides) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerBoundary(boundary);
        }
    }

    public onStateTransition(
        entity: Entity<BoundaryStateType>,
        from: BoundaryStateType,
        to: BoundaryStateType
    ) {
        if (
            !from.boundaryState.collides &&
            to.boundaryState.collides === true
        ) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerBoundary(to.boundaryState.boundary);
        }
        if (
            from.boundaryState.collides === true &&
            !to.boundaryState.collides
        ) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .unregisterBoundary(to.boundaryState.boundary);
        }
    }

    public onDestroy(entity: Entity<BoundaryStateType>) {
        entity
            .getServiceLocator()
            .getPhysicsService()
            .unregisterBoundary(entity.getState().boundaryState.boundary);
    }
}
