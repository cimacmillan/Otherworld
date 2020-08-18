import { Vector2D } from "../../../../types";
import { vec } from "../../../../util/math";
import { joinEffect } from "../../../effects/JoinEffect";
import { StateEffect } from "../../../effects/StateEffect";
import { timeoutEffect } from "../../../effects/TimeoutEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import {
    ChickenLogicState,
    ChickenStandingState,
    ChickenStateType,
    ChickenWalkingState,
} from "./ChickenState";

const COOLDOWN_TO_MS = 20000;
const ROAM_DISTANCE = 5;
const WALK_TIME = 5000;

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
                // [ChickenLogicState.HATCHING]: this.nextStateRandom(entity),
            },
            entity.getState().chickenState.logicState
        );
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

    private standingIdleEffect = (entity: Entity<ChickenStateType>) => {
        const cooldown = (entity.getState()
            .chickenState as ChickenStandingState).cooldown;
        const time = COOLDOWN_TO_MS * cooldown;
        return timeoutEffect(() => {
            entity.setState({
                chickenState: this.getRandomWalkState(entity),
            });
        }, time);
    };

    private walkingEffect = (entity: Entity<ChickenStateType>) => {
        let destination: Vector2D;
        let timeOnStart = 0;

        const onReachedDestination = () => {
            entity.setState({
                chickenState: this.getRandomStandingState(entity),
            });
        };

        return joinEffect(
            timeoutEffect(() => {
                onReachedDestination();
            }, WALK_TIME),
            {
                onEnter: () => {
                    timeOnStart = Date.now();
                    destination = (entity.getState()
                        .chickenState as ChickenWalkingState).destination;
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

                    const speed = 0.01;
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
            }
        );
    };

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

    // private nextStateRandom = (entity: Entity<ChickenStateType>) => {
    //     return timeoutEffect(() => {
    //         const possibleStates = [
    //             ChickenLogicState.STANDING_IDLE,
    //             ChickenLogicState.SITTING_IDLE,
    //             ChickenLogicState.WALKING,
    //             ChickenLogicState.SITTING,
    //             ChickenLogicState.JUMPING,
    //             ChickenLogicState.EATING,
    //             ChickenLogicState.SLEEPING,
    //             ChickenLogicState.HATCHING,
    //         ].filter(logicState => logicState !== entity.getState().logicState);
    //         entity.setState({
    //             logicState: randomSelection(possibleStates),
    //         });
    //     }, 1000);
    // };
}
