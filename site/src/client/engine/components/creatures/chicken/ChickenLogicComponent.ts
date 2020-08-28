import { Vector2D } from "../../../../types";
import { randomSelection, toGameVector, vec } from "../../../../util/math";
import { joinEffect } from "../../../effects/JoinEffect";
import { StateEffect } from "../../../effects/StateEffect";
import { timeoutEffect } from "../../../effects/TimeoutEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { GameEvent } from "../../../events/Event";
import { InteractionEventType } from "../../../events/InteractionEvents";
import {
    ChickenDamagedState,
    ChickenHatchingState,
    ChickenLogicState,
    ChickenNodes,
    ChickenRunningState,
    ChickenStandingState,
    ChickenStateType,
    ChickenWalkingState,
} from "./ChickenState";

const COOLDOWN_TO_MS = 20000;
const ROAM_DISTANCE = 5;
const WALK_TIME = 5000;
const HATCHING_TIME = 10000;
const DAMAGED_TIME = 200;
const RUNNING_AWAY_TIME = 3000;
const RUNNING_DISTANCE = 10;

// CHickens bugged they slowly end up doing nothing
export class ChickenLogicComponent
    implements EntityComponent<ChickenStateType> {
    public componentType = EntityComponentType.ChickenLogicComponent;

    private chickenStateBehaviour: StateEffect;

    public init(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour = new StateEffect(
            {
                [ChickenLogicState.STANDING_IDLE]: this.standingIdleEffect(
                    entity
                ),
                // [ChickenLogicState.SITTING_IDLE]: this.nextStateRandom(entity),
                [ChickenLogicState.WALKING]: this.walkingEffect(entity),
                // [ChickenLogicState.SITTING]: this.nextStateRandom(entity),
                // [ChickenLogicState.JUMPING]: this.nextStateRandom(entity),
                // [ChickenLogicState.EATING]: this.nextStateRandom(entity),
                // [ChickenLogicState.SLEEPING]: this.nextStateRandom(entity),
                [ChickenLogicState.HATCHING]: this.hatchingEffect(entity),
                [ChickenLogicState.DAMAGED]: this.damagedEffect(entity),
                [ChickenLogicState.RUNNING_AWAY]: this.runningAwayEffect(
                    entity
                ),
            },
            entity.getState().chickenState.logicState
        );
    }

    public onEvent(entity: Entity<ChickenStateType>, event: GameEvent): void {
        switch (event.type) {
            case InteractionEventType.ON_DAMAGED:
                const source = event.payload.source;
                if (source) {
                    const gameVector = toGameVector(source.angle);
                    const force = vec.vec_mult_scalar(gameVector, 0.5);
                    entity.setState({
                        chickenState: {
                            logicState: ChickenLogicState.DAMAGED,
                            source,
                        },
                        velocity: vec.vec_add(
                            entity.getState().velocity,
                            force
                        ),
                    });
                }
                break;
        }
    }

    public update(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.update();
    }

    public onCreate(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.load();
    }

    public onDestroy(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.unload();
    }

    public onStateTransition(
        entity: Entity<ChickenStateType>,
        from: ChickenStateType,
        to: ChickenStateType
    ) {
        this.chickenStateBehaviour.setState(to.chickenState.logicState);
    }

    private damagedEffect = (entity: Entity<ChickenStateType>) => {
        return timeoutEffect(() => {
            const currentPosition = entity.getState().position;
            const runAwayFrom = (entity.getState()
                .chickenState as ChickenDamagedState).source.angle;
            const diff = toGameVector(runAwayFrom);
            const destination = vec.vec_add(currentPosition, {
                x: diff.x * RUNNING_DISTANCE,
                y: diff.y * RUNNING_DISTANCE,
            });

            entity.setState({
                chickenState: {
                    logicState: ChickenLogicState.RUNNING_AWAY,
                    destination,
                },
            });
        }, DAMAGED_TIME);
    };

    private runningAwayEffect = (entity: Entity<ChickenStateType>) => {
        const onReachedDestination = () => {
            entity.setState({
                chickenState: this.getNextState(entity),
            });
        };

        return joinEffect(
            timeoutEffect(() => {
                onReachedDestination();
            }, RUNNING_AWAY_TIME),
            this.movingToEffect(
                entity,
                onReachedDestination,
                () =>
                    (entity.getState().chickenState as ChickenRunningState)
                        .destination,
                0.06
            )
        );
    };

    private hatchingEffect = (entity: Entity<ChickenStateType>) => {
        return timeoutEffect(() => {
            entity.setState({
                chickenState: this.getNextState(entity),
            });
        }, HATCHING_TIME);
    };

    private standingIdleEffect = (entity: Entity<ChickenStateType>) => {
        const cooldown = (entity.getState()
            .chickenState as ChickenStandingState).cooldown;
        const time = COOLDOWN_TO_MS * cooldown;
        return timeoutEffect(() => {
            entity.setState({
                chickenState: this.getNextState(entity),
            });
        }, time);
    };

    private walkingEffect = (entity: Entity<ChickenStateType>) => {
        let destination: Vector2D;
        const timeOnStart = 0;

        const onReachedDestination = () => {
            entity.setState({
                chickenState: this.getRandomStandingState(entity),
            });
        };

        return joinEffect(
            timeoutEffect(() => {
                onReachedDestination();
            }, WALK_TIME),
            this.movingToEffect(
                entity,
                onReachedDestination,
                () =>
                    (entity.getState().chickenState as ChickenWalkingState)
                        .destination,
                0.01
            )
        );
    };

    private movingToEffect(
        entity: Entity<ChickenStateType>,
        onReachedDestination: () => void,
        getDestination: () => Vector2D,
        speed: number
    ) {
        let timeOnStart: number;
        let destination: Vector2D;

        return {
            onEnter: () => {
                timeOnStart = Date.now();
                destination = getDestination();
            },
            onUpdate: () => {
                const timeInEffect = Date.now() - timeOnStart;
                const interp = timeInEffect / WALK_TIME;

                const position = entity.getState().position;
                const diff = vec.vec_sub(destination, position);

                // const velocity = vec.vec_mult_scalar(diff, 0.05);

                const distance = vec.vec_distance(diff);
                const xSpeed = diff.x / distance;
                const ySpeed = diff.y / distance;

                const velocity = {
                    x: xSpeed * speed,
                    y: ySpeed * speed,
                };

                entity.setState({
                    velocity,
                });

                if (Math.abs(diff.x) < 0.01 && Math.abs(diff.y) < 0.01) {
                    onReachedDestination();
                }
            },
        };
    }

    private getRandomWalkState(
        entity: Entity<ChickenStateType>
    ): ChickenWalkingState {
        const currentPosition = entity.getState().position;
        const destination = vec.vec_add(currentPosition, {
            x: (Math.random() - 0.5) * ROAM_DISTANCE,
            y: (Math.random() - 0.5) * ROAM_DISTANCE,
        });
        return {
            logicState: ChickenLogicState.WALKING,
            destination,
        };
    }

    private getRandomStandingState(
        entity: Entity<ChickenStateType>
    ): ChickenStandingState {
        return {
            logicState: ChickenLogicState.STANDING_IDLE,
            cooldown: Math.random(),
        };
    }

    private getRandomHatchingState(
        entity: Entity<ChickenStateType>
    ): ChickenHatchingState {
        return {
            logicState: ChickenLogicState.HATCHING,
        };
    }

    private getNextState = (entity: Entity<ChickenStateType>): ChickenNodes => {
        const nextState = randomSelection([
            this.getRandomWalkState(entity),
            this.getRandomStandingState(entity),
            this.getRandomHatchingState(entity),
        ]);
        // I am lazy
        if (
            entity.getState().chickenState.logicState === nextState.logicState
        ) {
            return this.getNextState(entity);
        }
        return nextState;
    };
}
