import { EffectType } from "../../engine/scripting/effects/Effects";
import { EquipmentType, Item, ItemType } from "../../engine/scripting/items/ItemTypes";

export enum GameItem {
    GOLD_KEY = "GOLD_KEY",
    GOLD_RING = "GOLD_RING",
    GOLD_COIN = "GOLD_COIN",

    WEAPON_WOOD_STICK = "WEAPON_WOOD_STICK"
}

export type GameItemMap = {
    [key in GameItem]: Item;
};

export const GameItems: GameItemMap = {
    [GameItem.GOLD_KEY]: {
        id: GameItem.GOLD_KEY,
        spriteIcon: "item_key",
        stackable: false,
        name: "Gold Key",
        type: ItemType.KEY,
        description: "I wonder what it unlocks",
    },
    [GameItem.GOLD_RING]: {
        id: GameItem.GOLD_RING,
        spriteIcon: "item_gold_ring",
        stackable: false,
        name: "Gold Ring",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.HEALTH_INCREASE,
                points: 1
            }
        ],
        equipmentType: EquipmentType.RING,
        description: "A ring I found inside someone's cell. It smells funny.",
    },
    [GameItem.WEAPON_WOOD_STICK]: {
        id: GameItem.WEAPON_WOOD_STICK,
        spriteIcon: "weapon_axe",
        stackable: false,
        name: "Wooden Club",
        type: ItemType.EQUIPMENT,
        description: "A heavy wooden club. It feels like it could bash some skulls.",
        onAttack: [
            {
                type: EffectType.DAMAGES_TARGET_IN_RANGE,
                a: 1,
                b: 2
            }
        ],
        equipmentType: EquipmentType.WEAPON
    },
    [GameItem.GOLD_COIN]: {
        id: GameItem.GOLD_COIN,
        type: ItemType.PRECIOUS,
        spriteIcon: "item_gold_coin",
        stackable: true,
        name: "Gold Coin",
        description: "A coin of gold, marked with the image of the Emperor",
        dropSize: 0.4
    }
};
