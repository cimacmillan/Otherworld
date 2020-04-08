import { BallEvents } from "./BallEvents";
import { EntityEvents } from "./EntityEvents";
import { PhysicsEvents } from "./PhysicsEvents";
import { TravelEvents } from "./TravelEvents";

export enum RootEventType {
    GAME_INITIALISED = "GameInitialised",
}

interface GameIntialised {
    type: RootEventType.GAME_INITIALISED;
}

export type GameEvent =
    | GameIntialised
    | EntityEvents
    | BallEvents
    | TravelEvents
    | PhysicsEvents;
