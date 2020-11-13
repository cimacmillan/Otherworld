import { MapPrison } from "../maps/Prison";
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
}

export enum Maps {
    PRISON = "PRISON",
}

const sprites = new SpriteSheetManifestBuilder("img/8bit-sprite-sheet.png");
sprites.Sprite(Sprites.FLOOR, 400, 400, 10, 10);
sprites.Sprite(Sprites.SLIME, 390, 10, 10, 10);

const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);
manifest.Map(Maps.PRISON, MapPrison);

export const defaultManifest = manifest;
