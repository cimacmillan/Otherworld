import {
    InteractionSource,
    InteractionType,
} from "../../../services/interaction/InteractionType";
import { throttleCount } from "../../../util/time/Throttle";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { SurfacePositionState } from "../../state/State";

type InteractableMap = { [key in InteractionType]?: boolean };

export interface InteractionState {
    interactable: InteractableMap;
}

export type InteractionStateType = SurfacePositionState & InteractionState;

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

export const onInteractedWith = <T extends InteractionStateType>(
    type: InteractionType,
    callback: (entity: Entity<T>, source: InteractionSource) => void
): EntityComponent<T> => {
    return {
        onEvent: (entity: Entity<T>, event: GameEvent) => {
            if (event.type === type) {
                callback(entity, event.source);
            }
        },
    };
};

export const onCanBeInteractedWithByPlayer = <T extends InteractionStateType>(
    type: InteractionType,
    onEnter: () => void,
    onLeave: () => void
): EntityComponent<T> => {
    let canBeInteractedWith = false;

    const onUpdate = (entity: Entity<T>) => {
        const player = entity
            .getServiceLocator()
            .getScriptingService()
            .getPlayer();
        const { position, angle } = player.getCamera();
        const interacts = entity
            .getServiceLocator()
            .getInteractionService()
            .getInteractables(InteractionType.INTERACT, position, angle, 1.5);
        const isInteractable = interacts.some(
            (interactable) => interactable === entity
        );
        if (isInteractable && canBeInteractedWith === false) {
            onEnter();
            canBeInteractedWith = true;
        }
        if (!isInteractable && canBeInteractedWith === true) {
            onLeave();
            canBeInteractedWith = false;
        }
    };

    return {
        update: throttleCount(onUpdate, 5),
    };
};
