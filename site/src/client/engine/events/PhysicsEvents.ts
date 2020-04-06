import { Vector2D } from "../../types";

interface Impulse {
    type: PhysicsEventType.IMPULSE;
    payload: ImpulsePayload;
}

interface ImpulsePayload {
    velocity: Vector2D;
}

export enum PhysicsEventType {
    IMPULSE = "IMPULSE",
}

export type PhysicsEvents = Impulse;
