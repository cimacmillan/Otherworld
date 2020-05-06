import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SurfacePositionState } from "../../state/State";

export interface PhysicsState {
    velocity: Vector2D;
    friction: number;
    mass: number;
    collides: boolean;
    elastic: number;
}

export type PhysicsStateType = BaseState & SurfacePositionState & PhysicsState;

export class PhysicsComponent<T extends PhysicsStateType>
    implements EntityComponent<T> {
    public onCreate(entity: Entity<PhysicsStateType>) {
        if (entity.getState().collides) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerPhysicsEntity(entity);
        }
    }

    public onStateTransition(
        entity: Entity<PhysicsStateType>,
        from: PhysicsStateType,
        to: PhysicsStateType
    ) {
        if (!from.collides && to.collides === true) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerPhysicsEntity(entity);
        }
        if (from.collides === true && !to.collides) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .unregisterPhysicsEntity(entity);
        }
    }

    public onDestroy(entity: Entity<PhysicsStateType>) {
        entity
            .getServiceLocator()
            .getPhysicsService()
            .unregisterPhysicsEntity(entity);
    }
}
