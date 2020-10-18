import {
    ResourceManifestBuilder,
    SpriteSheetManifestBuilder,
} from "../ResourceManifestBuilder";

export enum SpriteSheets {
    SPRITE = "SPRITE",
}

export enum Sprites {
    FLOOR = "FLOOR",
}

const sprites = new SpriteSheetManifestBuilder("img/8bit-sprite-sheet.png");
sprites.Sprite(Sprites.FLOOR, 400, 400, 10, 10);

const ui = new SpriteSheetManifestBuilder("img/ui.png");

const manifest: ResourceManifestBuilder = new ResourceManifestBuilder();
manifest.Spritesheet(SpriteSheets.SPRITE, sprites);

export const defaultManifest = manifest;
