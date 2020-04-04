import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import { Vector2D } from "../../types";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
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
        }
    }

    public onObservedEvent(
        entity: Entity<PlayerState>,
        event: GameEvent
    ): void {}

    private onCreate(entity: Entity<PlayerState>) {}

    private onDelete(entity: Entity<PlayerState>) {}

    private syncCamera(entity: Entity<PlayerState>) {
        const { position, height, angle, camera } = entity.getState();
        camera.position = position;
        camera.height = height;
        camera.angle = angle;
    }
}
