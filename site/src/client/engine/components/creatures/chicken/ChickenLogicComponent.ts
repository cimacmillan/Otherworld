import { randomSelection } from "../../../../util/math";
import { StateEffect } from "../../../effects/StateEffect";
import { timeoutEffect } from "../../../effects/TimeoutEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { ChickenLogicState, ChickenStateType } from "./ChickenState";

// CHickens bugged they slowly end up doing nothing
export class ChickenLogicComponent
    implements EntityComponent<ChickenStateType> {
    public componentType = EntityComponentType.ChickenLogicComponent;

    private chickenStateBehaviour: StateEffect;

    public init(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour = new StateEffect(
            {
                [ChickenLogicState.STANDING_IDLE]: this.nextStateRandom(entity),
                [ChickenLogicState.SITTING_IDLE]: this.nextStateRandom(entity),
                [ChickenLogicState.WALKING]: this.nextStateRandom(entity),
                [ChickenLogicState.SITTING]: this.nextStateRandom(entity),
                [ChickenLogicState.JUMPING]: this.nextStateRandom(entity),
                [ChickenLogicState.EATING]: this.nextStateRandom(entity),
                [ChickenLogicState.SLEEPING]: this.nextStateRandom(entity),
                [ChickenLogicState.HATCHING]: this.nextStateRandom(entity),
            },
            entity.getState().logicState
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
        this.chickenStateBehaviour.setState(to.logicState);
    }

    private nextStateRandom = (entity: Entity<ChickenStateType>) => {
        return timeoutEffect(() => {
            const possibleStates = [
                ChickenLogicState.STANDING_IDLE,
                ChickenLogicState.SITTING_IDLE,
                ChickenLogicState.WALKING,
                ChickenLogicState.SITTING,
                ChickenLogicState.JUMPING,
                ChickenLogicState.EATING,
                ChickenLogicState.SLEEPING,
                ChickenLogicState.HATCHING,
            ].filter(logicState => logicState !== entity.getState().logicState);
            entity.setState({
                logicState: randomSelection(possibleStates),
            });
        }, 1000);
    };
}
