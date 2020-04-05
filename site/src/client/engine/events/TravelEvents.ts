interface WalkForward {
    type: TravelEventType.WALK_FORWARD;
}

export enum TravelEventType {
    WALK_FORWARD = "WALK_FORWARD",
}

export type TravelEvents = WalkForward;
