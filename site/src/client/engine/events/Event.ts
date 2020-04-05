import { BallEvents } from "./BallEvents";
import { EntityEvents } from "./EntityEvents";
import { TravelEvents } from "./TravelEvents";

export type GameEvent = EntityEvents | BallEvents | TravelEvents;
