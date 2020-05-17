import { GameItems } from "../../../../resources/manifests/Items";
import { Audios } from "../../../../resources/manifests/Types";
import { InteractionType } from "../../../../services/interaction/InteractionType";
import { Vector2D } from "../../../../types";
import { joinEffect } from "../../../../util/engine/JoinEffect";
import {
    StateEffect,
    StateEffectCallback,
} from "../../../../util/engine/StateEffect";
import { timeoutEffect } from "../../../../util/engine/TimeoutEffect";
import { vec } from "../../../../util/math";
import { ActionDelay } from "../../../../util/time/ActionDelay";
import { Entity } from "../../../Entity";
import { EntityComponent } from "../../../EntityComponent";
import { EnemyEventType } from "../../../events/EnemyEvents";
import { GameEvent } from "../../../events/Event";
import { InteractionEventType } from "../../../events/InteractionEvents";
import {
    MacatorLogicState,
    MacatorState,
    MacatorType,
} from "../../../state/Macator";
import {
    BaseState,
    HealthState,
    SurfacePositionState,
} from "../../../state/State";
import { InteractionStateType } from "../../InteractionComponent";
import { PhysicsStateType } from "../../physics/PhysicsComponent";
import { SpriteStateType } from "../../rendering/SpriteRenderComponent";

export type MacatorStateType = BaseState &
    SpriteStateType &
    PhysicsStateType &
    InteractionStateType &
    MacatorLogicState &
    HealthState;

const WALK_SPEED = 0.008;
const ATTACK_SPEED = 0.03;
const SPY_RADIUS = 20;
const ATTACK_DELAY = 2000;
const ATTACK_DISTANCE = 0.6;

export class MacatorLogicComponent<T extends MacatorStateType>
    implements EntityComponent<T> {
    private attackDelay: ActionDelay;
    private macatorStateBehaviour: StateEffect;

    public init(entity: Entity<MacatorStateType>): void {
        this.attackDelay = new ActionDelay(ATTACK_DELAY);
        this.macatorStateBehaviour = new StateEffect(
            {
                [MacatorState.WALKING]: joinEffect(
                    this.attacksWhenClose(entity),
                    this.moveTowardsPlayer(entity, WALK_SPEED)
                ),
                [MacatorState.ATTACKING]: joinEffect(
                    this.damagesPlayer(entity),
                    this.moveTowardsPlayer(entity, ATTACK_SPEED),
                    timeoutEffect(
                        () =>
                            entity.setState({
                                macatorState: MacatorState.WALKING,
                            }),
                        400
                    )
                ),
                [MacatorState.DAMAGED]: joinEffect(
                    this.damagedEffect(entity),
                    timeoutEffect(() => {
                        entity.setState({
                            macatorState:
                                entity.getState().health > 0
                                    ? MacatorState.WALKING
                                    : MacatorState.DEAD,
                        });
                    }, 200)
                ),
                [MacatorState.DEAD]: this.deadEffect(entity),
            },
            entity.getState().macatorState
        );
    }

    public update(entity: Entity<MacatorStateType>) {
        this.macatorStateBehaviour.update();
    }

    public onEvent(entity: Entity<MacatorStateType>, event: GameEvent): void {
        switch (event.type) {
            case InteractionEventType.ON_DAMAGED:
                this.onDamaged(
                    entity,
                    event.payload.amount,
                    event.payload.source
                );
                break;
        }
    }

    public onStateTransition(
        entity: Entity<MacatorStateType>,
        from: MacatorStateType,
        to: MacatorStateType
    ) {
        if (from.macatorState !== to.macatorState) {
            this.macatorStateBehaviour.setState(to.macatorState);
        }
    }

    public onCreate(entity: Entity<MacatorStateType>) {
        this.macatorStateBehaviour.load();
    }

    public onDestroy(entity: Entity<MacatorStateType>) {
        this.macatorStateBehaviour.unload();
    }

    private attacksWhenClose(
        entity: Entity<MacatorStateType>
    ): StateEffectCallback {
        const onUpdate = () => {
            const playerPos = entity
                .getServiceLocator()
                .getScriptingService()
                .getPlayer()
                .getState().position;

            const macatorPos = entity.getState().position;
            if (
                vec.vec_distance(vec.vec_sub(playerPos, macatorPos)) <
                    SPY_RADIUS &&
                this.attackDelay.canAction()
            ) {
                entity.setState({
                    macatorState: MacatorState.ATTACKING,
                });
                this.attackDelay.onAction();
            }
        };

        return {
            onUpdate,
        };
    }

    private damagesPlayer(
        entity: Entity<MacatorStateType>
    ): StateEffectCallback {
        const onEnter = () => {
            entity
                .getServiceLocator()
                .getAudioService()
                .play3D(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.HISS],
                    [entity.getState().position.x, entity.getState().position.y]
                );
        };

        const onUpdate = () => {
            const playerPos = entity
                .getServiceLocator()
                .getScriptingService()
                .getPlayer()
                .getState().position;

            const macatorPos = entity.getState().position;
            if (
                vec.vec_distance(vec.vec_sub(playerPos, macatorPos)) <
                ATTACK_DISTANCE
            ) {
                this.attackDelay.onAction();
                entity.setState({
                    macatorState: MacatorState.WALKING,
                });

                entity
                    .getServiceLocator()
                    .getScriptingService()
                    .getPlayer()
                    .emit({
                        type: InteractionEventType.ON_DAMAGED,
                        payload: {
                            amount: 0.02,
                        },
                    });
            }
        };

        return {
            onEnter,
            onUpdate,
        };
    }

    private damagedEffect(
        entity: Entity<MacatorStateType>
    ): StateEffectCallback {
        return {
            onEnter: () => {},
        };
    }

    private deadEffect(entity: Entity<MacatorStateType>): StateEffectCallback {
        const onEnter = () => {
            entity.setState({
                interactable: {
                    ...entity.getState().interactable,
                    [InteractionType.ATTACK]: false,
                },
            });

            entity.emitGlobally({
                type: EnemyEventType.ENEMY_KILLED,
            });
        };

        return {
            onEnter,
        };
    }

    private moveTowardsPlayer(entity: Entity<MacatorStateType>, speed: number) {
        return {
            onUpdate: () => {
                const playerPos = entity
                    .getServiceLocator()
                    .getScriptingService()
                    .getPlayer()
                    .getState().position;
                const macatorPos = entity.getState().position;

                const direction = vec.vec_normalize(
                    vec.vec_sub(playerPos, macatorPos)
                );

                entity.setState(
                    {
                        velocity: vec.vec_add(
                            entity.getState().velocity,
                            vec.vec_mult_scalar(direction, speed)
                        ),
                    },
                    false
                );
            },
        };
    }

    private onDamaged(
        entity: Entity<MacatorStateType>,
        amount: number,
        source?: SurfacePositionState
    ) {
        if (
            entity.getState().macatorState !== MacatorState.WALKING &&
            entity.getState().macatorState !== MacatorState.ATTACKING
        ) {
            return;
        }

        const newHealth = entity.getState().health - amount;
        entity.setState({
            health: newHealth,
        });

        if (newHealth <= 0) {
            const force = {
                x: Math.sin(source.angle) * 0.5,
                y: -Math.cos(source.angle) * 0.5,
            };

            entity.setState(
                {
                    velocity: vec.vec_add(entity.getState().velocity, force),
                    macatorState: MacatorState.DAMAGED,
                },
                false
            );

            this.dropItems(entity, force);

            entity
                .getServiceLocator()
                .getAudioService()
                .play(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.POINT]
                );
        } else {
            entity.setState(
                {
                    velocity: vec.vec_add(entity.getState().velocity, {
                        x: Math.sin(source.angle) * 0.3,
                        y: -Math.cos(source.angle) * 0.3,
                    }),
                    macatorState: MacatorState.DAMAGED,
                },
                false
            );
        }
    }

    private dropItems(entity: Entity<MacatorStateType>, force: Vector2D) {
        let item;
        switch (entity.getState().macatorType) {
            case MacatorType.BROWN:
                item = GameItems.ITEM_BROWN_SHELL_FRAGMENT;
                break;
            case MacatorType.GREEN:
                item = GameItems.ITEM_GREEN_SHELL_FRAGMENT;
                break;
            case MacatorType.BLUE:
                item = GameItems.ITEM_BLUE_SHELL_FRAGMENT;
                break;
        }
        entity
            .getServiceLocator()
            .getScriptingService()
            .inventoryService.dropItems(
                {
                    item,
                    position: entity.getState().position,
                    force,
                },
                Math.floor(Math.random() * 3) + 1
            );

        if (Math.random() < 0.2) {
            entity
                .getServiceLocator()
                .getScriptingService()
                .inventoryService.dropItem({
                    item: GameItems.ITEM_MACATOR_INNARDS,
                    position: entity.getState().position,
                    force,
                });
        }
    }
}
