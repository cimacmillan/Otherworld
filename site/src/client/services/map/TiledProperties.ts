import { GameItem } from "../../resources/manifests/Items";
import { Maps } from "../../resources/manifests/Maps";
import { Sprites } from "../../resources/manifests/Sprites";

export enum TiledObjectType {
    Wall = "Wall",
    Door = "Door",
    SpawnPoint = "SpawnPoint",
    Floor = "Floor",
    GameItem = "GameItem",
    Portal = "Portal",
    StaticSprite = "StaticSprite",
}

export const defaultTiledObjectProperties: Record<
    TiledObjectType,
    Record<string, string>
> = {
    [TiledObjectType.Wall]: {
        sprite: Sprites.WALL,
    },
    [TiledObjectType.Door]: {
        sprite: Sprites.CELL,
    },
    [TiledObjectType.SpawnPoint]: {
        angle: "0",
        name: "BIRTH",
    },
    [TiledObjectType.Floor]: {
        sprite: Sprites.FLOOR,
        height: "0",
    },
    [TiledObjectType.GameItem]: {
        item: GameItem.GOLD_KEY,
    },
    [TiledObjectType.Portal]: {
        map: Maps.PRISON,
        spawn: "BIRTH",
    },
    [TiledObjectType.StaticSprite]: {
        sprite: Sprites.SKULL,
        height: "0.5",
    },
};
