import { PhysicsBoundary } from "../../../services/physics/PhysicsService";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export interface BoundaryState {
    boundaryState: {
        boundary: PhysicsBoundary;
        collides: boolean;
    };
}

export type BoundaryStateType = BoundaryState;

export class BoundaryComponent implements EntityComponent<BoundaryStateType> {
    public getActions(entity: Entity<BoundaryStateType>) {
        return {
            onEntityCreated: () => {
                const { boundary, collides } = entity.getState().boundaryState;
                if (collides) {
                    entity
                        .getServiceLocator()
                        .getPhysicsService()
                        .registerBoundary(boundary);
                }
            },
            onStateTransition: (from: any, to: any) => {
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
            },
            onEntityDeleted: () => {
                entity
                    .getServiceLocator()
                    .getPhysicsService()
                    .unregisterBoundary(
                        entity.getState().boundaryState.boundary
                    );
            },
        };
    }
}
