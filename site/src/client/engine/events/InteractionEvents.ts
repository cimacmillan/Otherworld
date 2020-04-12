import { SurfacePositionState } from "../State";

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

export enum InteractionEventType {
    ATTACK = "ATTACK",
    ON_DAMAGED = "ON_DAMAGED",
}

export type InteractionEvents = Attack | OnDamaged;
