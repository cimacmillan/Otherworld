import { Camera, GameMap, Sprite } from "../../types/TypesMap";

export interface WorldState {
    map: GameMap;
    camera: Camera;
    sprites: Sprite[];
}