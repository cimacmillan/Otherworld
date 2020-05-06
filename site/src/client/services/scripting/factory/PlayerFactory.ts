import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../../Config";
import { PhysicsComponent } from "../../../engine/components/physics/PhysicsComponent";
import {
    PlayerControlComponent,
    PlayerState,
} from "../../../engine/components/player/PlayerControlComponent";
import { Entity } from "../../../engine/Entity";
import { ServiceLocator } from "../../ServiceLocator";

export function createPlayer(serviceLocator: ServiceLocator) {
    const initialPosition = { x: 0, y: 2 };
    const initialAngle = 0;

    const initialState: PlayerState = {
        camera: {
            position: initialPosition,
            height: DEFAULT_PLAYER_HEIGHT,
            angle: initialAngle,
            fov: FOV,
            aspectRatio: ASPECT_RATIO,
            zNear: ZNEAR,
            zFar: ZFAR,
        },
        cameraShouldSync: true,
        position: initialPosition,
        height: DEFAULT_PLAYER_HEIGHT,
        radius: DEFAULT_PLAYER_RADIUS,
        angle: initialAngle,
        velocity: { x: 0, y: 0 },
        friction: 0.8,
        mass: 1,
        elastic: 0,
        health: 1,
        exists: false,
        collides: true,
    };

    return new Entity<PlayerState>(
        serviceLocator,
        initialState,
        new PhysicsComponent(),
        new PlayerControlComponent()
    );
}
