import { GameItem } from "../../../resources/manifests/Items";
import { Effect } from "../effects/Effects";

interface BaseItem {
    id: GameItem;
    spriteIcon: string;
    stackable: boolean;
    name: string;
    description: string;
}

interface KeyItem extends BaseItem {
    type: ItemCategory.KEY;
}

interface ConsumableItem extends BaseItem {
    type: ItemCategory.CONSUMABLE;
    onConsume?: Effect[];
}

export enum EquipmentType {
    WEAPON = "WEAPON",
    HELMET = "HELMET",
    SHIELD = "SHIELD",
    BODY = "BODY",
    SHOES = "SHOES",
    LRING = "LRING",
    RRING = "RRING"
} 

interface EquipableItem extends BaseItem {
    type: ItemCategory.EQUIPMENT;
    onAttack?: Effect[];
    onEquip?: Effect[];
    equipmentType: EquipmentType;
}

interface PreciousItem extends BaseItem {
    type: ItemCategory.PRECIOUS;
}

export type Item = KeyItem | EquipableItem | PreciousItem | ConsumableItem;

export enum ItemCategory {
    CONSUMABLE = "Consumable",
    CRAFTING = "Crafting",
    PRECIOUS = "Precious",
    KEY = "Key",
    EQUIPMENT = "Equipment"
}

export interface ItemMetadata {
    item: Item;
    count: number;
}

export interface Inventory {
    items: ItemMetadata[];
    equipped: Partial<Record<EquipmentType, Item | undefined>>;
}

export const getEmptyInventory = (): Inventory => ({
    items: [],
    equipped: {}
});

export type ItemComponent = ItemHealsPlayer | MakesNoiseWhenConsumed;

export interface ItemHealsPlayer {
    type: ItemComponentType.HEALS_PLAYER;
    amount: number;
}

export interface MakesNoiseWhenConsumed {
    type: ItemComponentType.MAKES_NOISE_WHEN_CONSUMED;
}

export enum ItemComponentType {
    HEALS_PLAYER = "HEALS_PLAYER",
    MAKES_NOISE_WHEN_CONSUMED = "MAKES_NOISE_WHEN_CONSUMED",
}
