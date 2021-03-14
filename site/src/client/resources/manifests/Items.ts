import { EffectType } from "../../engine/scripting/effects/Effects";
import { Item, ItemCategory } from "../../engine/scripting/items/ItemTypes";
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
        type: ItemCategory.KEY,
        description: "I wonder what it unlocks",
    },
    [GameItem.GOLD_RING]: {
        id: GameItem.GOLD_RING,
        spriteIcon: Sprites.ITEM_GOLD_RING,
        stackable: false,
        name: "Gold Ring",
        type: ItemCategory.PRECIOUS,
        description: "A ring I found inside someone's cell. It smells funny.",
    },
    [GameItem.WEAPON_WOOD_STICK]: {
        id: GameItem.WEAPON_WOOD_STICK,
        spriteIcon: Sprites.WEAPON_WOOD_STICK,
        stackable: false,
        name: "Wooden Club",
        type: ItemCategory.WEAPON,
        description: "A heavy wooden club. It feels like it could bash some skulls.",
        onEquip: [
            {
                type: EffectType.HEALS_SELF,
                points: 10
            },
            {
                type: EffectType.DAMAGES_TARGET,
                points: 8
            }
        ],
        onAttack: [
            {
                type: EffectType.DAMAGES_TARGET,
                points: 15
            },
            {
                type: EffectType.HEALS_SELF,
                points: 2
            },
        ]
    }
};
