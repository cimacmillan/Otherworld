import { PhysicsEntity } from "../../../services/physics/PhysicsService";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SurfacePositionState } from "../../state/State";

export interface PhysicsState {
    velocity: Vector2D;
    friction: number;
    mass: number;
    elastic: number;

    collidesEntities: boolean;
    collidesWalls: boolean;
}

export type PhysicsStateType = BaseState & SurfacePositionState & PhysicsState;

export class PhysicsComponent<T extends PhysicsStateType>
    implements EntityComponent<T> {
    private physicsEntity: PhysicsEntity;

    public onCreate(entity: Entity<PhysicsStateType>) {
        const { collidesEntities, collidesWalls } = entity.getState();
        this.physicsEntity = {
            entity,
            collidesEntities,
            collidesWalls,
        };
        entity
            .getServiceLocator()
            .getPhysicsService()
            .registerPhysicsEntity(this.physicsEntity);
    }

    public onDestroy(entity: Entity<PhysicsStateType>) {
        entity
            .getServiceLocator()
            .getPhysicsService()
            .unregisterPhysicsEntity(this.physicsEntity);
    }
}
