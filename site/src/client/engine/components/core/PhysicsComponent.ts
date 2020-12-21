import { PhysicsEntity } from "../../../services/physics/PhysicsService";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    SUFRACE_POSITION_STATE_DEFAULT,
    SurfacePositionState,
} from "../../state/State";

export interface PhysicsState {
    velocity: Vector2D;
    heightVelocity: number;
    friction: number;
    mass: number;
    elastic: number;

    collidesEntities: boolean;
    collidesWalls: boolean;
}

export const PHYSICS_STATE_DEFAULT: PhysicsState = {
    velocity: {
        x: 0,
        y: 0,
    },
    heightVelocity: 0,
    friction: 0.9,
    mass: 1,
    elastic: 0.9,
    collidesEntities: true,
    collidesWalls: true,
};

export type PhysicsStateType = SurfacePositionState & PhysicsState;

export class PhysicsComponent implements EntityComponent<PhysicsStateType> {
    private physicsEntity: PhysicsEntity;

    public getInitialState() {
        return {
            ...SUFRACE_POSITION_STATE_DEFAULT,
            ...PHYSICS_STATE_DEFAULT,
        };
    }

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
