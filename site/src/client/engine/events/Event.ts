import { BallEvents } from "./BallEvents";
import { EntityEvents } from "./EntityEvents";
import { PhysicsEvents } from "./PhysicsEvents";
import { TravelEvents } from "./TravelEvents";

export type GameEvent =
    | EntityEvents
    | BallEvents
    | TravelEvents
    | PhysicsEvents;
