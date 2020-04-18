import { InteractionType } from "../../services/interaction/InteractionType";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState, SurfacePositionState } from "../State";

type InteractableMap = { [key in InteractionType]?: boolean };

export interface InteractionState {
    interactable: InteractableMap;
}

export type InteractionStateType = BaseState &
    SurfacePositionState &
    InteractionState;

export class InteractionComponent<
    T extends InteractionStateType
> extends EntityComponent<T> {
    public init(entity: Entity<InteractionStateType>) {
        return {
            interactable: {},
        };
    }

    public update(entity: Entity<InteractionStateType>): void {}

    public onEvent(
        entity: Entity<InteractionStateType>,
        event: GameEvent
    ): void {}

    public onObservedEvent(
        entity: Entity<InteractionStateType>,
        event: GameEvent
    ): void {}

    public onStateTransition(
        entity: Entity<InteractionStateType>,
        from: InteractionStateType,
        to: InteractionStateType
    ) {
        const fromMap = from.interactable;
        const toMap = to.interactable;
        for (const type in InteractionType) {
            const interactionType = type as InteractionType;
            if (fromMap[interactionType] && !toMap[interactionType]) {
                entity
                    .getServiceLocator()
                    .getInteractionService()
                    .unregisterEntity(entity, interactionType);
            }
            if (!fromMap[interactionType] && toMap[interactionType]) {
                entity
                    .getServiceLocator()
                    .getInteractionService()
                    .registerEntity(entity, interactionType);
            }
        }
    }

    public onCreate(entity: Entity<T>): void {}

    public onDestroy(entity: Entity<InteractionStateType>) {
        for (const type in InteractionType) {
            const interactionType = type as InteractionType;
            if (entity.getState().interactable[interactionType]) {
                entity
                    .getServiceLocator()
                    .getInteractionService()
                    .unregisterEntity(entity, interactionType);
            }
        }
    }
}
