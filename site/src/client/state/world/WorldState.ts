import { Camera } from "../../types";
import { GameMap } from "../../types/TypesMap";

export interface WorldState {
    map: GameMap;
    camera: Camera;
}
