import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import {
    InteractionSourceType,
    InteractionType,
} from "../../services/interaction/InteractionType";
import { PhysicsEntity } from "../../services/physics/PhysicsService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Vector2D } from "../../types";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { vec } from "../../util/math/Vector";
import { ActionDelay } from "../../util/time/ActionDelay";
import { fpsNorm } from "../../util/time/GlobalFPSController";
import {
    InteractionComponent,
    InteractionStateType,
} from "../components/core/InteractionComponent";
import {
    PhysicsComponent,
    PhysicsStateType,
} from "../components/core/PhysicsComponent";
import { Entity } from "../Entity";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { PlayerEventType } from "../events/PlayerEvents";
import {
    TravelEventType,
    TurnDirection,
    WalkDirection,
} from "../events/TravelEvents";
import { Item } from "../scripting/items/types";
import { CameraState, HealthState, InventoryState } from "../state/State";

const WALK_SPEED = 0.02;
const TURN_SPEED = 0.15;
const HEAD_BOB_NERF = 0.6;

type InternalEntityState = PhysicsStateType &
    InteractionStateType &
    HealthState &
    CameraState &
    InventoryState;

export interface PlayerSerialisation {}

export class Player {
    private serviceLocator: ServiceLocator;
    private entity: Entity<InternalEntityState>;
    private accumulatedWalk: Vector2D = { x: 0, y: 0 };
    private accumulatedAngle: number = 0;
    private attackDelay: ActionDelay;
    private interactDelay: ActionDelay;

    private killed = false;
    private headbob: GameAnimation;
    private headbobOffset = 0;
    private physicsEntity: PhysicsEntity;

    public constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.attackDelay = new ActionDelay(300);
        this.interactDelay = new ActionDelay(300);

        const initialPosition = { x: 32, y: 32 };
        const initialAngle = 0;

        const initialState: InternalEntityState = {
            camera: {
                position: initialPosition,
                height: DEFAULT_PLAYER_HEIGHT,
                angle: initialAngle,
                fov: FOV,
                aspectRatio: ASPECT_RATIO,
                zNear: ZNEAR,
                zFar: ZFAR,
            },
            yOffset: 0,
            heightVelocity: 0,
            cameraShouldSync: true,
            position: initialPosition,
            height: 0,
            radius: DEFAULT_PLAYER_RADIUS,
            angle: initialAngle,
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 1,
            elastic: 0,
            health: 1,
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

        this.entity = new Entity<InternalEntityState>(
            undefined,
            this.serviceLocator,
            initialState,
            new PhysicsComponent(),
            new InteractionComponent()
        );

        this.attackDelay = new ActionDelay(300);
        this.headbob = animation((x: number) => {
            const velocity = this.entity.getState().velocity;
            const speed = vec.vec_distance(velocity);
            this.headbobOffset =
                Math.abs(Math.sin(x * Math.PI)) * speed * HEAD_BOB_NERF;
        })
            .speed(400)
            .looping()
            .start();
        this.entity.emitGlobally({
            type: PlayerEventType.PLAYER_INFO_CHANGE,
            payload: {
                health: this.entity.getState().health,
            },
        });

        this.entity.emit({
            type: EntityEventType.ENTITY_CREATED,
        });
    }

    public update(): void {
        this.entity.update();

        const state = this.entity.getState();

        this.headbob.tick();

        this.syncCamera();

        state.velocity = vec.vec_add(state.velocity, this.accumulatedWalk);
        state.angle = state.angle + this.accumulatedAngle;

        this.accumulatedAngle = 0;
        this.accumulatedWalk = { x: 0, y: 0 };
    }

    public onEvent(event: GameEvent): void {
        switch (event.type) {
            case TravelEventType.WALK:
                this.onWalk(this.entity, event.payload);
                break;
            case TravelEventType.TURN:
                this.onTurn(this.entity, event.payload);
                break;

            case "TEMP_INTERACT_COMMAND":
                this.onInteract();
                break;
            case PlayerEventType.PLAYER_ITEM_DROP_COLLECTED:
                this.onPickedUp(event.payload.item);
                break;
            case PlayerEventType.PLAYER_ITEM_USED:
                this.onItemUsed(event.payload.item);
                break;
            // case InteractionEventType.ATTACK:
            //     if (this.attackDelay.canAction()) {
            //         this.onAttack(entity);
            //     }
            //     break;
            // case InteractionEventType.ON_DAMAGED:
            //     this.onDamaged(entity, event.payload.amount);
            //     break;
            case PlayerEventType.PLAYER_HEALED:
                const health = this.entity.getState().health;
                const newHealth = Math.min(1, health + event.payload.amount);
                this.entity.setState({
                    health: newHealth,
                });
                this.entity.emitGlobally({
                    type: PlayerEventType.PLAYER_INFO_CHANGE,
                    payload: {
                        health: this.entity.getState().health,
                    },
                });
                break;
        }
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

    public getCamera() {
        return this.entity.getState().camera;
    }

    public getPositon() {
        return this.entity.getState().position;
    }

    private onInteract() {
        if (!this.interactDelay.canAction()) {
            return;
        }
        this.interactDelay.onAction();
        const state = this.entity.getState();
        const interacts = this.serviceLocator
            .getInteractionService()
            .getInteractables(
                InteractionType.INTERACT,
                state.position,
                state.angle,
                1.5
            );
        interacts.forEach((ent) => {
            if (ent === this.entity) {
                return;
            }

            ent.emit({
                type: InteractionType.INTERACT,
                source: {
                    type: InteractionSourceType.PLAYER,
                    player: this,
                },
            });
        });
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

        let hasAttacked = false;

        attacks.forEach((attacked) => {
            if (attacked === entity) {
                return;
            }

            hasAttacked = true;

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

    private onWalk(
        entity: Entity<InternalEntityState>,
        direction: WalkDirection
    ) {
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

    private onTurn(
        entity: Entity<InternalEntityState>,
        direction: TurnDirection
    ) {
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

    private syncCamera() {
        const { position, height, angle, camera } = this.entity.getState();
        camera.position = position;
        camera.angle = angle;
        camera.height = height + this.headbobOffset + DEFAULT_PLAYER_HEIGHT;
    }

    private onPickedUp(item: Item) {
        const { inventory } = this.entity.getState();

        let countIncreased = false;
        for (let x = 0; x < inventory.items.length; x++) {
            const itemMetadata = inventory.items[x];
            if (
                itemMetadata.item.id === item.id &&
                itemMetadata.item.stackable
            ) {
                itemMetadata.count++;
                countIncreased = true;
                break;
            }
        }

        if (!countIncreased) {
            inventory.items.push({
                item,
                count: 1,
            });
        }

        this.entity.setState({ inventory });
    }

    private onItemUsed(item: Item) {
        const { inventory } = this.entity.getState();
        const items = [...inventory.items];

        for (let x = 0; x < inventory.items.length; x++) {
            const itemMetadata = items[x];
            if (itemMetadata.item.id === item.id) {
                itemMetadata.count--;
                break;
            }
        }

        const newInventory = {
            items: items.filter((item) => item.count > 0),
        };

        this.entity.setState({
            inventory: newInventory,
        });
    }
}
