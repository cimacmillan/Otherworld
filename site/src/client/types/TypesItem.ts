export interface Item {
    id: number;
    spriteIcon: number;
    stackable: boolean;
    name: string;
    behaviours: ItemComponent[];
}

export interface Inventory {
    items: Item[];
}

export type ItemComponent = ItemHealsPlayer | ItemCanBeTraded;

export interface ItemHealsPlayer {
    type: ItemType.HEALS_PLAYER;
    amount: number;
}

export interface ItemCanBeTraded {
    type: ItemType.CAN_BE_TRADED;
    price: number;
}

export enum ItemType {
    HEALS_PLAYER = "HEALS_PLAYER",
    CAN_BE_TRADED = "CAN_BE_TRADED",
}
