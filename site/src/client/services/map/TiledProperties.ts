import { Sprites } from "../../resources/manifests/Sprites";

export enum TiledObjectType {
    Wall = "Wall",
    Door = "Door",
    SpawnPoint = "SpawnPoint",
    Floor = "Floor",
}

export const defaultTiledObjectProperties: Record<
    TiledObjectType,
    Record<string, string>
> = {
    [TiledObjectType.Wall]: {
        sprite: Sprites.WALL,
    },
    [TiledObjectType.Door]: {},
    [TiledObjectType.SpawnPoint]: {
        angle: "0",
        name: "BIRTH",
    },
    [TiledObjectType.Floor]: {
        sprite: Sprites.FLOOR,
        height: "0",
    },
};
