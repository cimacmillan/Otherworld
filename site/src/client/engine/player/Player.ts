import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import { GameEventSource } from "../../services/EventRouter";
import {
    InteractionSourceType,
    InteractionType,
} from "../../services/interaction/InteractionType";
import { PhysicsRegistration } from "../../services/physics/PhysicsService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Camera, Vector2D } from "../../types";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { vec } from "../../util/math/Vector";
import { ActionDelay } from "../../util/time/ActionDelay";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import { InteractionStateType } from "../components/core/InteractionComponent";
import { PhysicsStateType } from "../components/core/PhysicsComponent";
import { Entity } from "../Entity";
import { PlayerEventType } from "../events/PlayerEvents";
import { TurnDirection, WalkDirection } from "../events/TravelEvents";
import { getEmptyInventory, Inventory } from "../scripting/items/types";
import { CameraState, HealthState } from "../state/State";

const WALK_SPEED = 0.02;
const TURN_SPEED = 0.15;
const HEAD_BOB_NERF = 0.6;

type InternalEntityState = PhysicsStateType & HealthState & CameraState;

export interface PlayerSerialisation {}

export class Player {
    public inventory: Inventory = getEmptyInventory();

    public surface: PhysicsStateType;
    private serviceLocator: ServiceLocator;
    // private entity: Entity<InternalEntityState>;
    private accumulatedWalk: Vector2D = { x: 0, y: 0 };
    private accumulatedAngle: number = 0;
    private attackDelay: ActionDelay;
    private interactDelay: ActionDelay;

    private killed = false;
    private headbob: GameAnimation;
    private headbobOffset = 0;
    private health = 1;

    private physicsRegistration: PhysicsRegistration;

    public constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;

        this.attackDelay = new ActionDelay(300);
        this.interactDelay = new ActionDelay(300);

        this.surface = {
            position: { x: 31.5, y: 31.5 },
            height: 0,
            angle: 0,
            yOffset: 0,
            radius: DEFAULT_PLAYER_RADIUS,
            heightVelocity: 0,
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 1,
            elastic: 0,
            collidesEntities: true,
            collidesWalls: true,
        };

        this.attackDelay = new ActionDelay(300);
        this.headbob = animation((x: number) => {
            const velocity = this.surface.velocity;
            const speed = vec.vec_distance(velocity);
            this.headbobOffset =
                Math.abs(Math.sin(x * Math.PI)) * speed * HEAD_BOB_NERF;
        })
            .speed(400)
            .looping()
            .start();
        this.serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
            type: PlayerEventType.PLAYER_INFO_CHANGE,
            payload: {
                health: this.health,
            },
        });

        this.physicsRegistration = {
            collidesEntities: true,
            collidesWalls: true,
            setHeight: (height: number) => (this.surface.height = height),
            setHeightVelocity: (heightVelocity: number) =>
                (this.surface.heightVelocity = heightVelocity),
            setVelocity: (x: number, y: number) =>
                (this.surface.velocity = { x, y }),
            setPosition: (x: number, y: number) => {
                this.surface.position = { x, y };
            },
            getPhysicsInformation: () => this.surface,
        };
        this.serviceLocator
            .getPhysicsService()
            .registerPhysicsEntity(this.physicsRegistration);
    }

    public update(): void {
        this.headbob.tick();

        this.surface.velocity = vec.vec_add(
            this.surface.velocity,
            this.accumulatedWalk
        );
        this.surface.angle = this.surface.angle + this.accumulatedAngle;

        this.accumulatedAngle = 0;
        this.accumulatedWalk = { x: 0, y: 0 };
    }

    public onStateTransition(
        entity: Entity<InteractionStateType>,
        from: InternalEntityState,
        to: InternalEntityState
    ): void {
        entity.emitGlobally({
            type: PlayerEventType.PLAYER_INFO_CHANGE,
            payload: {
                health: to.health,
            },
        });
    }

    public getCamera(): Camera {
        const { position, height, angle } = this.surface;
        const cameraHeight =
            height + this.headbobOffset + DEFAULT_PLAYER_HEIGHT;
        return {
            position,
            angle,
            height: cameraHeight,
            fov: FOV,
            aspectRatio: ASPECT_RATIO,
            zNear: ZNEAR,
            zFar: ZFAR,
        };
    }

    public getPositon() {
        return this.surface.position;
    }

    public getInventory() {
        return this.inventory;
    }

    public interact() {
        if (!this.interactDelay.canAction()) {
            return;
        }
        this.interactDelay.onAction();
        const state = this.surface;
        const interacts = this.serviceLocator
            .getInteractionService()
            .getInteractables(
                InteractionType.INTERACT,
                state.position,
                state.angle,
                1.5
            );
        interacts.forEach((ent) => {
            // if (ent.entity === this.entity) {
            //     return;
            // }

            ent.onInteract &&
                ent.onInteract({
                    type: InteractionSourceType.PLAYER,
                    player: this,
                });
        });
    }

    public walk(direction: WalkDirection) {
        const speed = fpsNorm(WALK_SPEED);
        let camera_add = { x: 0, y: 0 };
        switch (direction) {
            case WalkDirection.FORWARD:
                camera_add = vec.vec_rotate(
                    { x: 0, y: -speed },
                    this.surface.angle
                );
                break;
            case WalkDirection.BACK:
                camera_add = vec.vec_rotate(
                    { x: 0, y: speed },
                    this.surface.angle
                );
                break;
            case WalkDirection.LEFT:
                camera_add = vec.vec_rotate(
                    { x: -speed, y: 0 },
                    this.surface.angle
                );
                break;
            case WalkDirection.RIGHT:
                camera_add = vec.vec_rotate(
                    { x: speed, y: 0 },
                    this.surface.angle
                );
                break;
        }
        this.accumulatedWalk = vec.vec_add(this.accumulatedWalk, camera_add);
    }

    public turn(direction: TurnDirection) {
        const speed = fpsNorm(TURN_SPEED);
        switch (direction) {
            case TurnDirection.ANTICLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle - speed / 3;
                break;
            case TurnDirection.CLOCKWISE:
                this.accumulatedAngle = this.accumulatedAngle + speed / 3;
                break;
        }
    }

    private onDamaged(entity: Entity<InternalEntityState>, amount: number) {
        entity.setState({ health: entity.getState().health - amount });
        // entity
        //     .getServiceLocator()
        //     .getAudioService()
        //     .play(
        //         entity.getServiceLocator().getResourceManager().manifest.audio[
        //             Audios.PLAYER_HIT
        //         ]
        //     );
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

    private onAttack(entity: Entity<InternalEntityState>) {
        entity.emitGlobally({
            type: PlayerEventType.PLAYER_ATTACK,
        });

        // entity
        //     .getServiceLocator()
        //     .getAudioService()
        //     .play(
        //         entity.getServiceLocator().getResourceManager().manifest.audio[
        //             Audios.WHOOSH
        //         ]
        //     );

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

        const hasAttacked = false;

        attacks.forEach((attacked) => {
            // if (attacked === entity) {
            //     return;
            // }
            // hasAttacked = true;
            // attacked.emit({
            //     type: InteractionEventType.ON_DAMAGED,
            //     payload: {
            //         amount: 0.4,
            //         source: state,
            //     },
            // });
        });

        if (hasAttacked) {
            // entity
            //     .getServiceLocator()
            //     .getAudioService()
            //     .play(
            //         entity.getServiceLocator().getResourceManager().manifest
            //             .audio[Audios.SLAM]
            //     );
        }
    }
}
