import { GameItem } from "../../resources/manifests/Items";
import { Maps } from "../../resources/manifests/Maps";

export enum TiledObjectType {
    Wall = "Wall",
    Door = "Door",
    SpawnPoint = "SpawnPoint",
    Floor = "Floor",
    GameItem = "GameItem",
    Portal = "Portal",
    StaticSprite = "StaticSprite",
    NPC = "NPC"
}

export const defaultTiledObjectProperties: Record<
    TiledObjectType,
    Record<string, string>
> = {
    [TiledObjectType.Wall]: {
        sprite: "wall",
        height: "1",
        offset: "0",
        collides: "true"
    },
    [TiledObjectType.Door]: {
        sprite: "cell",
    },
    [TiledObjectType.SpawnPoint]: {
        angle: "0",
        name: "BIRTH",
    },
    [TiledObjectType.Floor]: {
        sprite: "floor",
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
        sprite: "skull",
        height: "0.5",
    },
    [TiledObjectType.NPC]: {
        npcTypeId: "jailor"
    }
};
