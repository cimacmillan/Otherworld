import { Item, ItemCategory } from "../../engine/scripting/items/types";
import { Sprites } from "./Sprites";

export enum GameItem {
    GOLD_KEY = "GOLD_KEY",
    GOLD_RING = "GOLD_RING",

    WEAPON_WOOD_STICK = "WEAPON_WOOD_STICK"
}

export type GameItemMap = {
    [key in GameItem]: Item;
};

export const GameItems: GameItemMap = {
    [GameItem.GOLD_KEY]: {
        id: GameItem.GOLD_KEY,
        spriteIcon: Sprites.ITEM_KEY,
        stackable: false,
        name: "Gold Key",
        behaviours: [],
        category: ItemCategory.KEY,
        description: "I wonder what it unlocks",
    },
    [GameItem.GOLD_RING]: {
        id: GameItem.GOLD_RING,
        spriteIcon: Sprites.ITEM_GOLD_RING,
        stackable: false,
        name: "Gold Ring",
        behaviours: [],
        category: ItemCategory.PRECIOUS,
        description: "A ring I found inside someone's cell. It smells funny.",
    },
    [GameItem.WEAPON_WOOD_STICK]: {
        id: GameItem.WEAPON_WOOD_STICK,
        spriteIcon: Sprites.WEAPON_WOOD_STICK,
        stackable: false,
        name: "Wooden Club",
        behaviours: [],
        category: ItemCategory.WEAPON,
        description: "A heavy wooden club. It feels like it could bash some skulls."
    }
};
