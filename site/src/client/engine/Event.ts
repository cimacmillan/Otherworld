
export enum BaseEventType {
    STATE_TRANSITION,
    CREATED,
    DELETE
}

export interface Event {
    type: BaseEventType
}


