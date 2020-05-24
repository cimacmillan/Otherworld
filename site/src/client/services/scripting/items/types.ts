export interface Item {
    id: number;
    spriteIcon: number;
    stackable: boolean;
    name: string;
    tradePrice?: number;
    behaviours: ItemComponent[];
    category: ItemCategory;
}

export enum ItemCategory {
    CONSUMABLE = "CONSUMABLE",
    CRAFTING = "CRAFTING",
}

export interface ItemMetadata {
    item: Item;
    count: number;
}

export interface Inventory {
    items: ItemMetadata[];
}

export type ItemComponent = ItemHealsPlayer;

export interface ItemHealsPlayer {
    type: ItemComponentType.HEALS_PLAYER;
    amount: number;
}

export enum ItemComponentType {
    HEALS_PLAYER = "HEALS_PLAYER",
}
