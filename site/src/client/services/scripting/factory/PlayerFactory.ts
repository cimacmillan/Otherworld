import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../../Config";
import {
    PhysicsComponent,
    PhysicsStateType,
} from "../../../engine/components/physics/PhysicsComponent";
import { PlayerControlComponent } from "../../../engine/components/player/PlayerControlComponent";
import { PlayerInventoryComponent } from "../../../engine/components/player/PlayerInventoryComponent";
import { Entity } from "../../../engine/Entity";
import {
    BaseState,
    CameraState,
    HealthState,
    InventoryState,
} from "../../../engine/state/State";
import { GameItems } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../ServiceLocator";

export type PlayerState = BaseState &
    PhysicsStateType &
    CameraState &
    HealthState &
    InventoryState;

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
        collidesWalls: true,
        collidesEntities: true,
        inventory: {
            items: [],
        },
    };

    return new Entity<PlayerState>(
        serviceLocator,
        initialState,
        new PhysicsComponent(),
        new PlayerControlComponent(),
        new PlayerInventoryComponent()
    );
}
