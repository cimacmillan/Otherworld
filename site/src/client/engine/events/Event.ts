import { BallEvents } from "./BallEvents";
import { EntityEvents } from "./EntityEvents";

export type GameEvent = EntityEvents | BallEvents;
