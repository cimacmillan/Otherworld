import {
    InteractionSource,
    InteractionType,
} from "../../services/interaction/InteractionType";

interface OnInteract {
    type: InteractionType;
    source: InteractionSource;
}

// TODO Refactor player and delete this

interface InteractCommand {
    type: "TEMP_INTERACT_COMMAND";
}

// interface OnDamaged {
//     type: InteractionEventType.ON_DAMAGED;
//     payload: {
//         amount: number;
//         source?: SurfacePositionState;
//     };
// }

// interface OnBarter {
//     type: InteractionEventType.ON_BARTER;
//     payload: {
//         source: Entity<InventoryState & BaseState>;
//         target: Entity<InventoryState & BaseState>;
//     };
// }

export type InteractionEvents = OnInteract | InteractCommand;
