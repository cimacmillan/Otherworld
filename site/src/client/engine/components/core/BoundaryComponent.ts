import { PhysicsBoundary } from "../../../services/physics/PhysicsService";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";

export interface BoundaryState {
    boundaryState: {
        boundary: PhysicsBoundary;
        collides: boolean;
    };
}

export type BoundaryStateType = BoundaryState;

export class BoundaryComponent implements EntityComponent<BoundaryStateType> {
    public getInitialState = () => ({
        boundaryState: {
            boundary: {
                start: {
                    x: 0,
                    y: 0,
                },
                end: {
                    x: 1,
                    y: 0,
                },
            },
            collides: true,
        },
    });

    public update(entity: Entity<BoundaryStateType>): void {}

    public onEvent(entity: Entity<BoundaryStateType>, event: GameEvent): void {}

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
                .unregisterBoundary(from.boundaryState.boundary);
        }
    }

    public onDestroy(entity: Entity<BoundaryStateType>) {
        entity
            .getServiceLocator()
            .getPhysicsService()
            .unregisterBoundary(entity.getState().boundaryState.boundary);
    }
}
