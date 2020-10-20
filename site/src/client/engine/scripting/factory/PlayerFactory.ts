import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../../Config";
import { ServiceLocator } from "../../../services/ServiceLocator";
import {
    InteractionComponent,
    InteractionState,
} from "../../components/core/InteractionComponent";
import {
    PhysicsComponent,
    PhysicsStateType,
} from "../../components/core/PhysicsComponent";
import { PlayerControlComponent } from "../../components/player/PlayerControlComponent";
import { PlayerInventoryComponent } from "../../components/player/PlayerInventoryComponent";
import { Entity } from "../../Entity";
import {
    BaseState,
    CameraState,
    HealthState,
    InventoryState,
} from "../../state/State";

export type PlayerState = BaseState &
    PhysicsStateType &
    CameraState &
    HealthState &
    InventoryState &
    InteractionState;

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
            items: [
                // {
                //     item: GameItems.GOLD,
                //     count: 10,
                // },
            ],
        },
        interactable: {
            ATTACK: true,
        },
    };

    return new Entity<PlayerState>(
        undefined,
        serviceLocator,
        initialState,
        new PhysicsComponent(),
        new PlayerControlComponent(),
        new PlayerInventoryComponent(),
        new InteractionComponent()
    );
}
