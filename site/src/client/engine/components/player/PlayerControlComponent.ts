import { Audios } from "../../../resources/manifests/Types";
import { InteractionType } from "../../../services/interaction/InteractionType";
import { Vector2D } from "../../../types";
import { animation } from "../../../util/animation/Animations";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { vec } from "../../../util/math";
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
import { PlayerState } from "../../../services/scripting/factory/PlayerFactory";

const WALK_SPEED = 0.02;
const TURN_SPEED = 0.15;
const HEAD_BOB_NERF = 0.6;

export class PlayerControlComponent<T extends PlayerState>
    implements EntityComponent<T> {
    private accumulatedWalk: Vector2D = { x: 0, y: 0 };
    private accumulatedAngle: number = 0;
    private attackDelay: ActionDelay;
    private killed = false;
    private headbob: GameAnimation;
    private headbobOffset = 0;

    public init(entity: Entity<PlayerState>) {
        this.attackDelay = new ActionDelay(300);
        this.headbob = animation((x: number) => {
            const velocity = entity.getState().velocity;
            const speed = vec.vec_distance(velocity);
            this.headbobOffset =
                Math.abs(Math.sin(x * Math.PI)) * speed * HEAD_BOB_NERF;
        })
            .speed(400)
            .looping()
            .start();
    }

    public update(entity: Entity<PlayerState>): void {
        const state = entity.getState();

        this.headbob.tick();

        if (state.cameraShouldSync) {
            this.syncCamera(entity);
        }

        state.velocity = vec.vec_add(state.velocity, this.accumulatedWalk);
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

    public onStateTransition(entity: Entity<T>, from: T, to: T): void {
        entity.emitGlobally({
            type: PlayerEventType.PLAYER_INFO_CHANGE,
        });
    }

    private onDamaged(entity: Entity<PlayerState>, amount: number) {
        entity.setState({ health: entity.getState().health - amount });
        entity
            .getServiceLocator()
            .getAudioService()
            .play(
                entity.getServiceLocator().getResourceManager().manifest.audio[
                    Audios.PLAYER_HIT
                ]
            );
        entity
            .getServiceLocator()
            .getRenderService()
            .screenShakeService.shake(1);
        if (entity.getState().health <= 0 && !this.killed) {
            entity.emitGlobally({ type: PlayerEventType.PLAYER_KILLED });
            entity.getServiceLocator().getScriptingService().endGame();
            this.killed = true;
        } else if (!this.killed) {
            entity.emitGlobally({
                type: PlayerEventType.PLAYER_DAMAGED,
            });
        }
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
                1.5
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
                camera_add = vec.vec_rotate({ x: 0, y: -speed }, state.angle);
                break;
            case WalkDirection.BACK:
                camera_add = vec.vec_rotate({ x: 0, y: speed }, state.angle);
                break;
            case WalkDirection.LEFT:
                camera_add = vec.vec_rotate({ x: -speed, y: 0 }, state.angle);
                break;
            case WalkDirection.RIGHT:
                camera_add = vec.vec_rotate({ x: speed, y: 0 }, state.angle);
                break;
        }
        this.accumulatedWalk = vec.vec_add(this.accumulatedWalk, camera_add);
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
        camera.angle = angle;
        camera.height = height + this.headbobOffset;
    }
}
