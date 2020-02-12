export type GameEvent =
EntityEvents;

export enum EntityEventType {
    STATE_TRANSITION = "STATE_TRANSITION",
    ENTITY_CREATED = "ENTITY_CREATED",
    ENTITY_DELETED = "ENTITY_DELETED",
}

interface EntityCreated {
    type: EntityEventType.ENTITY_CREATED;
}

interface EntityDeleted {
    type: EntityEventType.ENTITY_DELETED;
}

interface StateTransitionEvent {
    type: EntityEventType.STATE_TRANSITION;
    payload: {
        from: any,
        to: any,
    };
}

export type EntityEvents = StateTransitionEvent | EntityCreated | EntityDeleted;
