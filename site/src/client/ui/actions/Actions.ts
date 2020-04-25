import { GameEvent } from "../../engine/events/Event";
import { GameStartActions } from "./GameStartActions";

export type Actions = GameEvent | GameStartActions;
