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

interface WeaponItem extends BaseItem {
    type: ItemCategory.WEAPON;
    onAttack?: Effect[];
    onEquip?: Effect[];
}

interface PreciousItem extends BaseItem {
    type: ItemCategory.PRECIOUS;
}

export type Item = KeyItem | WeaponItem | PreciousItem | ConsumableItem;

export enum ItemCategory {
    CONSUMABLE = "Consumable",
    CRAFTING = "Crafting",
    PRECIOUS = "Precious",
    KEY = "Key",
    WEAPON = "Weapon"
}

export interface ItemMetadata {
    item: Item;
    count: number;
}

export interface Inventory {
    items: ItemMetadata[];
    equipped: ItemMetadata[];
}

export const getEmptyInventory = (): Inventory => ({
    items: [],
    equipped: []
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
