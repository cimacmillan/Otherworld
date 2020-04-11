

import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState, SurfacePositionState } from "../State";
import { InteractionType } from "../../services/interaction/InteractionType";

type InteractableMap = {[key in InteractionType]?: boolean};

export interface InteractionState {
    interactable: InteractableMap
}

export type InteractionStateType = BaseState & SurfacePositionState & InteractionState;

export class InteractionComponent<
    T extends InteractionStateType
> extends EntityComponent<T> {
    public init(entity: Entity<InteractionStateType>) {
        return {};
    }

    public update(entity: Entity<InteractionStateType>): void {}

    public onEvent(entity: Entity<InteractionStateType>, event: GameEvent): void {

    }

    public onObservedEvent(
        entity: Entity<InteractionStateType>,
        event: GameEvent
    ): void {}
}
