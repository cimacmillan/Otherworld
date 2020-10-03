import { Entity } from "../Entity";
import {
    BaseState,
    InventoryState,
    SurfacePositionState,
} from "../state/State";

interface Attack {
    type: InteractionEventType.ATTACK;
}

interface OnDamaged {
    type: InteractionEventType.ON_DAMAGED;
    payload: {
        amount: number;
        source?: SurfacePositionState;
    };
}

interface OnBarter {
    type: InteractionEventType.ON_BARTER;
    payload: {
        source: Entity<InventoryState & BaseState>;
        target: Entity<InventoryState & BaseState>;
    };
}

export enum InteractionEventType {
    ATTACK = "ATTACK",
    ON_DAMAGED = "ON_DAMAGED",
    ON_BARTER = "ON_BARTER",
}

export type InteractionEvents = Attack | OnDamaged | OnBarter;
