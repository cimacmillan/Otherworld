import { InteractionType } from "../../../services/interaction/InteractionType";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState, SurfacePositionState } from "../../state/State";

type InteractableMap = { [key in InteractionType]?: boolean };

export interface InteractionState {
    interactable: InteractableMap;
}

export type InteractionStateType = BaseState &
    SurfacePositionState &
    InteractionState;

export class InteractionComponent<T extends InteractionStateType>
    implements EntityComponent<T> {
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

    public onCreate(entity: Entity<InteractionStateType>) {
        for (const type in InteractionType) {
            const interactionType = type as InteractionType;
            if (entity.getState().interactable[interactionType]) {
                entity
                    .getServiceLocator()
                    .getInteractionService()
                    .registerEntity(entity, interactionType);
            }
        }
    }
}
