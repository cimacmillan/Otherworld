import { InteractionRegistration } from "../../../services/interaction/InteractionService";
import {
    InteractionSource,
    InteractionType,
} from "../../../services/interaction/InteractionType";
import { throttleCount } from "../../../util/time/Throttle";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    SUFRACE_POSITION_STATE_DEFAULT,
    SurfacePositionState,
} from "../../state/State";
import { JoinComponent } from "../util/JoinComponent";

type InteractableMap = { [key in InteractionType]?: boolean };

export type InteractionStateType = SurfacePositionState;

// export class InteractionComponent
//     implements EntityComponent<InteractionStateType> {
//     public getInitialState() {
//         return {
//             ...SUFRACE_POSITION_STATE_DEFAULT,
//             interactable: {},
//         };
//     }

//     public onStateTransition(
//         entity: Entity<InteractionStateType>,
//         from: InteractionStateType,
//         to: InteractionStateType
//     ) {
//         const fromMap = from.interactable;
//         const toMap = to.interactable;
//         for (const type in InteractionType) {
//             const interactionType = type as InteractionType;
//             if (fromMap[interactionType] && !toMap[interactionType]) {
//                 entity
//                     .getServiceLocator()
//                     .getInteractionService()
//                     .unregisterEntity(entity, interactionType);
//             }
//             if (!fromMap[interactionType] && toMap[interactionType]) {
//                 entity
//                     .getServiceLocator()
//                     .getInteractionService()
//                     .registerEntity(entity, interactionType);
//             }
//         }
//     }

//     public onDestroy(entity: Entity<InteractionStateType>) {
//         for (const type in InteractionType) {
//             const interactionType = type as InteractionType;
//             if (entity.getState().interactable[interactionType]) {
//                 entity
//                     .getServiceLocator()
//                     .getInteractionService()
//                     .unregisterEntity(entity, interactionType);
//             }
//         }
//     }

//     public onCreate(entity: Entity<InteractionStateType>) {
//         for (const type in InteractionType) {
//             const interactionType = type as InteractionType;
//             if (entity.getState().interactable[interactionType]) {
//                 entity
//                     .getServiceLocator()
//                     .getInteractionService()
//                     .registerEntity(entity, interactionType);
//             }
//         }
//     }
// }

const registersSelf = (
    type: InteractionType,
    registration: (
        entity: Entity<SurfacePositionState>
    ) => InteractionRegistration
): EntityComponent<SurfacePositionState> => {
    return {
        getInitialState: () => SUFRACE_POSITION_STATE_DEFAULT,
        onCreate: (entity: Entity<SurfacePositionState>) => {
            entity
                .getServiceLocator()
                .getInteractionService()
                .registerEntity(registration(entity), type);
        },
        onDestroy: (entity: Entity<SurfacePositionState>) => {
            entity
                .getServiceLocator()
                .getInteractionService()
                .unregisterEntity(registration(entity), type);
        },
    };
};

export const onInteractedWith = <T extends InteractionStateType>(
    type: InteractionType,
    callback: (entity: Entity<T>, source: InteractionSource) => void
): EntityComponent<InteractionStateType> => {
    return registersSelf(type, (entity: Entity<T>) => ({
        onInteract: (source: InteractionSource) => callback(entity, source),
        getPosition: () => entity.getState(),
        entity,
    }));
};

export const onCanBeInteractedWithByPlayer = <T extends InteractionStateType>(
    type: InteractionType,
    onEnter: () => void,
    onLeave: () => void
): EntityComponent<InteractionStateType> => {
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
            (interactable) => interactable.entity === entity
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

    return JoinComponent<SurfacePositionState>([
        {
            getInitialState: () => SUFRACE_POSITION_STATE_DEFAULT,
            update: throttleCount(onUpdate, 5),
        },
        registersSelf(type, (entity: Entity<T>) => ({
            getPosition: () => entity.getState(),
            entity,
        })),
    ]);
};
