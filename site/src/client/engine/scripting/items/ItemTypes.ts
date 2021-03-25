import { GameItem, GameItems } from "../../../resources/manifests/Items";
import { Effect } from "../effects/Effects";

interface BaseItem {
    id: GameItem;
    spriteIcon: string;
    stackable: boolean;
    name: string;
    description: string;
}

interface KeyItem extends BaseItem {
    type: ItemType.KEY;
}

interface ConsumableItem extends BaseItem {
    type: ItemType.CONSUMABLE;
    onConsume?: Effect[];
}

export enum EquipmentType {
    WEAPON = "WEAPON",
    HELMET = "HELMET",
    SHIELD = "SHIELD",
    BODY = "BODY",
    SHOES = "SHOES",
    RING = "RING"
} 

export interface EquipableItem extends BaseItem {
    type: ItemType.EQUIPMENT;
    onAttack?: Effect[];
    onEquip?: Effect[];
    onUnEquip?: Effect[];
    equipmentType: EquipmentType;
    stackable: false;
}

interface PreciousItem extends BaseItem {
    type: ItemType.PRECIOUS;
}

export type Item = KeyItem | EquipableItem | PreciousItem | ConsumableItem;

export enum ItemType {
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
    equipped: Partial<Record<EquipmentType, EquipableItem | undefined>>;
}

export const getEmptyInventory = (): Inventory => ({
    items: [    

    ],
    equipped: {
        
    }
});

