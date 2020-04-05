export enum WalkDirection {
    FORWARD = "FORWARD",
    BACK = "BACK",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum TurnDirection {
    CLOCKWISE = "CLOCKWISE",
    ANTICLOCKWISE = "ANTICLOCKWISE",
}

interface Walk {
    type: TravelEventType.WALK;
    payload: WalkDirection;
}

interface Turn {
    type: TravelEventType.TURN;
    payload: TurnDirection;
}

export enum TravelEventType {
    WALK = "WALK",
    TURN = "TURN",
}

export type TravelEvents = Walk | Turn;
