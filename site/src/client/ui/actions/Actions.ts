import { GameEvent } from "../../engine/events/Event";
import { GameStartActions } from "./GameStartActions";
import { MiniGameUIActions } from "./MiniGameActions";

export type Actions = GameEvent | GameStartActions | MiniGameUIActions;
