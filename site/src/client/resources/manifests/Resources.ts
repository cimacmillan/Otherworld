import { MapPrison } from "../maps/maps/Prison";
import {
    ResourceManifestBuilder,
    SpriteSheetManifestBuilder,
} from "../ResourceManifestBuilder";

export enum SpriteSheets {
    SPRITE = "SPRITE",
}

export enum Sprites {
    FLOOR = "FLOOR",
    SLIME = "SLIME",
    WALL = "WALL",
    CELL = "CELL",
}

export enum Maps {
    PRISON = "PRISON",
}

const sprites = new SpriteSheetManifestBuilder("img/8bit-sprite-sheet.png");
sprites.Sprite(Sprites.FLOOR, 90, 160, 10, 10);
sprites.Sprite(Sprites.SLIME, 390, 10, 10, 10);
sprites.Sprite(Sprites.WALL, 90, 150, 10, 10);
sprites.Sprite(Sprites.CELL, 100, 150, 10, 10);

const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);
manifest.Map(Maps.PRISON, MapPrison);

export const defaultManifest = manifest;
