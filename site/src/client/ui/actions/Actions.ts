import { GameStartActions } from "./GameStartActions";
import { GameEvent } from "../../engine/events/Event";

export type Actions = 
    | GameEvent
    | GameStartActions;
