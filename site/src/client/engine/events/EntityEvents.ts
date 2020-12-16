interface EntityCreated {
    type: EntityEventType.ENTITY_CREATED;
}

interface EntityDeleted {
    type: EntityEventType.ENTITY_DELETED;
}

export interface StateTransitionEvent<State> {
    type: EntityEventType.STATE_TRANSITION;
    payload: {
        from: State;
        to: State;
    };
}

export enum EntityEventType {
    STATE_TRANSITION = "STATE_TRANSITION",
    ENTITY_CREATED = "ENTITY_CREATED",
    ENTITY_DELETED = "ENTITY_DELETED",
}

export type EntityEvents =
    | StateTransitionEvent<any>
    | EntityCreated
    | EntityDeleted;
