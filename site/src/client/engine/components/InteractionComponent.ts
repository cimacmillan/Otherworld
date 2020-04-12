import { InteractionType } from "../../services/interaction/InteractionType";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
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
    ): void {
        switch (event.type) {
            case EntityEventType.STATE_TRANSITION:
                this.onStateTransition(
                    entity,
                    event.payload.from as InteractionStateType,
                    event.payload.to as InteractionStateType
                );
                break;
            case EntityEventType.ENTITY_DELETED:
                this.onDeleted(entity);
                break;
        }
    }

    public onObservedEvent(
        entity: Entity<InteractionStateType>,
        event: GameEvent
    ): void {}

    private onStateTransition(
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

    private onDeleted(entity: Entity<InteractionStateType>) {
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
