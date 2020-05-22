export interface Item {
    id: number;
    spriteIcon: number;
    stackable: boolean;
    name: string;
    tradePrice?: number;
    behaviours: ItemComponent[];
}

export interface Inventory {
    items: Item[];
}

export type ItemComponent = ItemHealsPlayer;

export interface ItemHealsPlayer {
    type: ItemType.HEALS_PLAYER;
    amount: number;
}

export enum ItemType {
    HEALS_PLAYER = "HEALS_PLAYER",
}
