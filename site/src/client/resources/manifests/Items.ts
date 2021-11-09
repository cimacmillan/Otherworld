import { EffectType } from "../../engine/scripting/effects/Effects";
import { ConsumableItem, EquipableItem, EquipmentType, Item, ItemType } from "../../engine/scripting/items/ItemTypes";

export enum GameItem {
    GOLD_KEY = "GOLD_KEY",
    GOLD_RING = "GOLD_RING",
    GOLD_COIN = "GOLD_COIN",

    WEAPON_WOOD_STICK = "WEAPON_WOOD_STICK",

    EQUIPMENT_CHEST = "EQUIPMENT_CHEST",
    EQUIPMENT_GREAVES = "EQUIPMENT_GREAVES",
    EQUIPMENT_SHIELD = "EQUIPMENT_SHIELD",
    EQUIPMENT_HELMET = "EQUIPMENT_HELMET",
}

export type GameItemMap = {
    [key in GameItem]: Item;
};

export const createBasicFood = (
    spriteIcon: string,
    name: string,
    description: string,
    health: number
): ConsumableItem => ({
    id: spriteIcon,
    type: ItemType.CONSUMABLE,
    name,
    description,
    spriteIcon,
    stackable: true,
    onConsume: [
        {
            type: EffectType.HEALS_SELF,
            points: health
        }
    ]
})

export const createBasicSword = (
    spriteIcon: string,
    name: string,
    description: string,
    damage: number
): EquipableItem => ({
    id: `${Math.random()}`,
    spriteIcon,
    stackable: false,
    name,
    type: ItemType.EQUIPMENT,
    description,
    onAttack: [
        {
            type: EffectType.DAMAGES_TARGET_IN_RANGE,
            a: damage,
            b: damage + 1
        }
    ],
    equipmentType: EquipmentType.WEAPON
});

export const createAncientSword = (): EquipableItem => ({
    ...createBasicSword(
        "weapon_demon_staff",
        "Demon Staff",
        "A staff made from the bones of a long dead demon",
        50
    ),
    onEquip: [{
        type: EffectType.ANCIENT_POWER
    }],
    onAttack: [{
        type: EffectType.DAMAGES_TARGET_IN_RANGE,
        a: 30,
        b: 50
    }],
});

export const GameItems: GameItemMap = {
    [GameItem.GOLD_KEY]: {
        id: GameItem.GOLD_KEY,
        spriteIcon: "item_key",
        stackable: false,
        name: "Gold Key",
        type: ItemType.KEY,
        description: "I wonder what it unlocks",
    },
    [GameItem.WEAPON_WOOD_STICK]: createBasicSword("weapon_wood_stick", "Wooden Club", "A heavy wooden club, good for bashing some heads", 1),
    [GameItem.GOLD_COIN]: {
        id: GameItem.GOLD_COIN,
        type: ItemType.PRECIOUS,
        spriteIcon: "item_gold_coin",
        stackable: true,
        name: "Gold Coin",
        description: "Marked with the image of the Emperor",
        dropSize: 0.4
    },
    [GameItem.GOLD_RING]: {
        id: GameItem.GOLD_RING,
        spriteIcon: "item_gold_ring",
        stackable: false,
        name: "Ring of Power",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.ANCIENT_POWER,
            },
            {
                type: EffectType.ATTACK_SPEED_INCREASE,
            },
            {
                type: EffectType.HEALTH_INCREASE,
                points: 10
            }
        ],
        equipmentType: EquipmentType.RING,
        description: "Pulls my arm as I swing",
    },
    [GameItem.EQUIPMENT_HELMET]: {
        id: GameItem.EQUIPMENT_HELMET,
        spriteIcon: "equipment_helmet",
        stackable: false,
        name: "Helmet of Intellect",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.ANCIENT_POWER,
            },
            {
                type: EffectType.ACCURACY_INCREASE,
            },
            {
                type: EffectType.HEALTH_INCREASE,
                points: 20
            }
        ],
        equipmentType: EquipmentType.HELMET,
        description: "Sharpens my eyes and hones my thrust",
    },
    [GameItem.EQUIPMENT_CHEST]: {
        id: GameItem.EQUIPMENT_CHEST,
        spriteIcon: "equipment_chestplate",
        stackable: false,
        name: "Chestplate of Endurance",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.ANCIENT_POWER,
            },
            {
                type: EffectType.HEALTH_INCREASE,
                points: 200
            }
        ],
        equipmentType: EquipmentType.BODY,
        description: "Imbued with intense life force",
    },
    [GameItem.EQUIPMENT_SHIELD]: {
        id: GameItem.EQUIPMENT_SHIELD,
        spriteIcon: "equipment_shield",
        stackable: false,
        name: "Shield of the Guardians",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.ANCIENT_POWER,
            },
            {
                type: EffectType.HEALTH_INCREASE,
                points: 40
            },
            {
                type: EffectType.PROTECTION_INCREASE,
            }
        ],
        equipmentType: EquipmentType.SHIELD,
        description: "Awards with the protection of the forefathers",
    },
    [GameItem.EQUIPMENT_GREAVES]: {
        id: GameItem.EQUIPMENT_GREAVES,
        spriteIcon: "equipment_greaves",
        stackable: false,
        name: "Greaves of Swift",
        type: ItemType.EQUIPMENT,
        onEquip: [
            {
                type: EffectType.ANCIENT_POWER,
            },
            {
                type: EffectType.HEALTH_INCREASE,
                points: 30
            },
            {
                type: EffectType.SPEED_INCREASE,
            }
        ],
        equipmentType: EquipmentType.SHOES,
        description: "Speed gifted by the ancients",
    }
};
