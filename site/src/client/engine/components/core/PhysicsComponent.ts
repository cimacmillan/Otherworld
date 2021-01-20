import { PhysicsRegistration } from "../../../services/physics/PhysicsService";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { SurfacePosition } from "../../state/State";

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

export type PhysicsStateType = SurfacePosition & PhysicsState;

export const PhysicsComponent = (): EntityComponent<PhysicsStateType> => {
    let physicsRegistration: PhysicsRegistration;

    return {
        onCreate: (entity: Entity<PhysicsStateType>) => {
            const { collidesEntities, collidesWalls } = entity.getState();
            physicsRegistration = {
                collidesWalls,
                collidesEntities,
                setHeight: (height: number) => entity.setState({ height }),
                setHeightVelocity: (heightVelocity: number) =>
                    entity.setState({ heightVelocity }),
                setVelocity: (x, y) => entity.setState({ velocity: { x, y } }),
                setPosition: (x, y) => entity.setState({ position: { x, y } }),
                getPhysicsInformation: () => entity.getState(),
            };
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerPhysicsEntity(physicsRegistration);
        },
        onDestroy: (entity: Entity<PhysicsStateType>) => {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .unregisterPhysicsEntity(physicsRegistration);
        },
    };
};
