import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../../Config";
import { InteractionType } from "../../../services/interaction/InteractionType";
import { Audios } from "../../../services/resources/manifests/Types";
import { Vector2D } from "../../../types";
import { vec_add, vec_rotate } from "../../../util/math";
import { ActionDelay } from "../../../util/time/ActionDelay";
import { fpsNorm } from "../../../util/time/GlobalFPSController";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { InteractionEventType } from "../../events/InteractionEvents";
import { PlayerEventType } from "../../events/PlayerEvents";
import {
    TravelEventType,
    TurnDirection,
    WalkDirection,
} from "../../events/TravelEvents";
import { BaseState, CameraState, HealthState } from "../../State";
import { PhysicsStateType } from "../PhysicsComponent";

export type PlayerState = BaseState &
    PhysicsStateType &
    CameraState &
    HealthState;

const WALK_SPEED = 0.02;
const TURN_SPEED = 0.1;

export class PlayerControlComponent<
    T extends PlayerState
> extends EntityComponent<T> {
    private accumulatedWalk: Vector2D = { x: 0, y: 0 };
    private accumulatedAngle: number = 0;
    private attackDelay: ActionDelay;
    private killed = false;

    public constructor(
        private initialPosition: Vector2D,
        private initialAngle: number
    ) {
        super();
        this.attackDelay = new ActionDelay(300);
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
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 1,
            elastic: 0,
            health: 1,
        };
    }

    public update(entity: Entity<PlayerState>): void {
        const state = entity.getState();

        if (state.cameraShouldSync) {
            this.syncCamera(entity);
        }

        state.velocity = vec_add(state.velocity, this.accumulatedWalk);
        state.angle = state.angle + this.accumulatedAngle;

        this.accumulatedAngle = 0;
        this.accumulatedWalk = { x: 0, y: 0 };
    }

    public onEvent(entity: Entity<PlayerState>, event: GameEvent): void {
        switch (event.type) {
            case TravelEventType.WALK:
                this.onWalk(entity, event.payload);
                break;
            case TravelEventType.TURN:
                this.onTurn(entity, event.payload);
                break;
            case InteractionEventType.ATTACK:
                if (this.attackDelay.canAction()) {
                    this.onAttack(entity);
                }
                break;
            case InteractionEventType.ON_DAMAGED:
                this.onDamaged(entity, event.payload.amount);
                break;
        }
    }

    public onObservedEvent(
        entity: Entity<PlayerState>,
        event: GameEvent
    ): void {}

    public onCreate(entity: Entity<PlayerState>) {
        entity.setState(
            {
                collides: true,
            },
            true
        );
    }

    public onDestroy(entity: Entity<PlayerState>) {
        entity.setState(
            {
                collides: false,
            },
            true
        );
    }

    public onStateTransition(entity: Entity<T>, from: T, to: T): void {}

    private onDamaged(entity: Entity<PlayerState>, amount: number) {
        entity.setState({ health: entity.getState().health - amount });
        if (entity.getState().health <= 0 && !this.killed) {
            entity.emitGlobally({
                type: PlayerEventType.PLAYER_KILLED,
            });
            this.onKilled(entity);
            this.killed = true;
            entity
                .getServiceLocator()
                .getAudioService()
                .play(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.END]
                );
        } else if (!this.killed) {
            entity.emitGlobally({
                type: PlayerEventType.PLAYER_DAMAGED,
            });
            entity
                .getServiceLocator()
                .getAudioService()
                .play(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.PLAYER_HIT]
                );
        }
    }

    private onKilled(entity: Entity<PlayerState>) {
        entity.getServiceLocator().getScriptingService().resetContent();
    }

    private onAttack(entity: Entity<PlayerState>) {
        entity.emitGlobally({
            type: PlayerEventType.PLAYER_ATTACK,
        });

        entity
            .getServiceLocator()
            .getAudioService()
            .play(
                entity.getServiceLocator().getResourceManager().manifest.audio[
                    Audios.WHOOSH
                ]
            );

        this.attackDelay.onAction();
        const state = entity.getState();
        const attacks = entity
            .getServiceLocator()
            .getInteractionService()
            .getInteractables(
                InteractionType.ATTACK,
                state.position,
                state.angle,
                1
            );

        if (attacks.length > 0) {
            entity
                .getServiceLocator()
                .getAudioService()
                .play(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.SLAM]
                );
        }
        attacks.forEach((attacked) => {
            attacked.emit({
                type: InteractionEventType.ON_DAMAGED,
                payload: {
                    amount: 0.4,
                    source: state,
                },
            });
        });
    }

    private onWalk(entity: Entity<PlayerState>, direction: WalkDirection) {
        const speed = fpsNorm(WALK_SPEED);
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
        this.accumulatedWalk = vec_add(this.accumulatedWalk, camera_add);
    }

    private onTurn(entity: Entity<PlayerState>, direction: TurnDirection) {
        const speed = fpsNorm(TURN_SPEED);
        const state = entity.getState();
        switch (direction) {
            case TurnDirection.ANTICLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle - speed / 3;
                break;
            case TurnDirection.CLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle + speed / 3;
                break;
        }
    }

    private syncCamera(entity: Entity<PlayerState>) {
        const { position, height, angle, camera } = entity.getState();
        camera.position = position;
        camera.height = height;
        camera.angle = angle;
    }
}
