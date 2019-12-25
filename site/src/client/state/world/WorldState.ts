import { GameMap } from "../../types/TypesMap";
import { Camera } from "../../types";

export interface WorldState {
    map: GameMap;
    camera: Camera;
}