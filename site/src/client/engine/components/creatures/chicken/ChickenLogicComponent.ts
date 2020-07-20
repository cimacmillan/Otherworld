import { StateEffect } from "../../../effects/StateEffect";
import { Entity } from "../../../Entity";
import { EntityComponent, EntityComponentType } from "../../../EntityComponent";
import { ChickenStateType } from "./ChickenState";

export class ChickenLogicComponent
    implements EntityComponent<ChickenStateType> {
    public componentType = EntityComponentType.ChickenLogicComponent;

    private chickenStateBehaviour: StateEffect;

    public init(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour = new StateEffect(
            {},
            entity.getState().logicState
        );
    }

    public update(entity: Entity<ChickenStateType>) {}

    public onCreate(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.load();
    }

    public onDestroy(entity: Entity<ChickenStateType>) {
        this.chickenStateBehaviour.unload();
    }

    // public onEvent?: (entity: Entity<ChickenStateType>, event: import("../../../events/Event").GameEvent) => void;
    // public onObservedEvent?: (entity: Entity<ChickenStateType>, event: import("../../../events/Event").GameEvent) => void;
    // public onStateTransition?: (entity: Entity<ChickenStateType>, from: ChickenStateType, to: ChickenStateType) => void;
}
