interface Attack {
    type: InteractionEventType.ATTACK;
}

export enum InteractionEventType {
    ATTACK = "ATTACK",
}

export type InteractionEvents = Attack;
