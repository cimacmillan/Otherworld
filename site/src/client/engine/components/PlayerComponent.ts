import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import { Vector2D } from "../../types";
import { vec_add, vec_rotate } from "../../util/math";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import {
    TravelEventType,
    TurnDirection,
    WalkDirection,
} from "../events/TravelEvents";
import { BaseState, CameraState, SurfacePositionState } from "../State";

export type PlayerState = BaseState & SurfacePositionState & CameraState;

export class PlayerComponent extends EntityComponent<PlayerState> {
    public constructor(
        private initialPosition: Vector2D,
        private initialAngle: number
    ) {
        super();
    }

    public init(entity: Entity<PlayerState>) {
        return {
            camera: {
                position: this.initialPosition,
                height: DEFAULT_PLAYER_HEIGHT,
                angle: this.initialAngle,
                fov: FOV,
                aspectRatio: ASPECT_RATIO,
                zNear: ZNEAR,
                zFar: ZFAR,
            },
            cameraShouldSync: true,
            position: this.initialPosition,
            height: DEFAULT_PLAYER_HEIGHT,
            radius: DEFAULT_PLAYER_RADIUS,
            angle: this.initialAngle,
        };
    }

    public update(entity: Entity<PlayerState>): void {
        if (entity.getState().cameraShouldSync) {
            this.syncCamera(entity);
        }
    }

    public onEvent(entity: Entity<PlayerState>, event: GameEvent): void {
        switch (event.type) {
            case EntityEventType.ENTITY_CREATED:
                this.onCreate(entity);
                break;
            case EntityEventType.ENTITY_DELETED:
                this.onDelete(entity);
                break;
            case TravelEventType.WALK:
                this.onWalk(entity, event.payload);
                break;
            case TravelEventType.TURN:
                this.onTurn(entity, event.payload);
                break;
        }
    }

    public onObservedEvent(
        entity: Entity<PlayerState>,
        event: GameEvent
    ): void {}

    private onWalk(entity: Entity<PlayerState>, direction: WalkDirection) {
        const speed = fpsNorm(0.1);
        const state = entity.getState();
        let camera_add = { x: 0, y: 0 };
        switch (direction) {
            case WalkDirection.FORWARD:
                camera_add = vec_rotate({ x: 0, y: -speed }, state.angle);
                break;
            case WalkDirection.BACK:
                camera_add = vec_rotate({ x: 0, y: speed }, state.angle);
                break;
            case WalkDirection.LEFT:
                camera_add = vec_rotate({ x: -speed, y: 0 }, state.angle);
                break;
            case WalkDirection.RIGHT:
                camera_add = vec_rotate({ x: speed, y: 0 }, state.angle);
                break;
        }
        state.position = vec_add(state.position, camera_add);
    }

    private onTurn(entity: Entity<PlayerState>, direction: TurnDirection) {
        const speed = fpsNorm(0.1);
        const state = entity.getState();
        switch (direction) {
            case TurnDirection.ANTICLOCKWISE:
                state.angle = state.angle - speed / 3;
                break;
            case TurnDirection.CLOCKWISE:
                state.angle = state.angle + speed / 3;
                break;
        }
    }

    private onCreate(entity: Entity<PlayerState>) {}

    private onDelete(entity: Entity<PlayerState>) {}

    private syncCamera(entity: Entity<PlayerState>) {
        const { position, height, angle, camera } = entity.getState();
        camera.position = position;
        camera.height = height;
        camera.angle = angle;
    }
}
