import { SpriteSheetManifestBuilder } from "../ResourceManifestBuilder";

export enum SpriteSheets {
    SPRITE = "SPRITE",
}

export enum Sprites {
    UI_FINGER = "UI_FINGER",

    FLOOR = "FLOOR",
    FLOOR_BLOOD = "FLOOR_BLOOD",
    SLIME = "SLIME",
    WALL = "WALL",
    HANGING_MAN = "HANGING_MAN",

    SKULL = "SKULL",
    BONE = "BONE",

    CELL = "CELL",
    ITEM_KEY = "ITEM_KEY",
    ITEM_GOLD_RING = "ITEM_GOLD_RING",
    LADDER = "LADDER",
    FLOOR_HOLE = "FLOOR_HOLE",

    WEAPON_WOOD_STICK = "WEAPON_WOOD_STICK",
}

export const sprites = new SpriteSheetManifestBuilder(
    "img/8bit-sprite-sheet.png"
);
const tenSprite = (sprite: string, x: number, y: number) =>
    sprites.Sprite(sprite, x, y, 10, 10);
tenSprite(Sprites.FLOOR, 90, 160);
tenSprite(Sprites.FLOOR_BLOOD, 90, 170);
tenSprite(Sprites.FLOOR_HOLE, 100, 160);
tenSprite(Sprites.SLIME, 390, 10);
tenSprite(Sprites.WALL, 90, 150);
tenSprite(Sprites.CELL, 100, 150);
tenSprite(Sprites.ITEM_KEY, 540, 160);
tenSprite(Sprites.ITEM_GOLD_RING, 0, 270);
tenSprite(Sprites.LADDER, 110, 160);

tenSprite(Sprites.SKULL, 550, 190);
tenSprite(Sprites.BONE, 530, 190);

tenSprite(Sprites.WEAPON_WOOD_STICK, 540, 430);

tenSprite(Sprites.UI_FINGER, 80, 140);

sprites.Sprite(Sprites.HANGING_MAN, 70, 150, 20, 20);
