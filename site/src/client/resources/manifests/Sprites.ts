import { SpriteSheetManifestBuilder } from "../ResourceManifestBuilder";

export enum SpriteSheets {
    SPRITE = "SPRITE",
}

export enum Sprites {
    FLOOR = "FLOOR",
    SLIME = "SLIME",
    WALL = "WALL",
    CELL = "CELL",
    ITEM_KEY = "ITEM_KEY",
}

export const sprites = new SpriteSheetManifestBuilder(
    "img/8bit-sprite-sheet.png"
);
const tenSprite = (sprite: Sprites, x: number, y: number) =>
    sprites.Sprite(sprite, x, y, 10, 10);
tenSprite(Sprites.FLOOR, 90, 160);
tenSprite(Sprites.SLIME, 390, 10);
tenSprite(Sprites.WALL, 90, 150);
tenSprite(Sprites.CELL, 100, 150);
tenSprite(Sprites.ITEM_KEY, 540, 160);
