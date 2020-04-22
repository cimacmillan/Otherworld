import { BallEvents } from "./BallEvents";
import { EnemyEvents } from "./EnemyEvents";
import { EntityEvents } from "./EntityEvents";
import { InteractionEvents } from "./InteractionEvents";
import { PhysicsEvents } from "./PhysicsEvents";
import { PlayerEvents } from "./PlayerEvents";
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
    | PhysicsEvents
    | InteractionEvents
    | PlayerEvents
    | EnemyEvents;
