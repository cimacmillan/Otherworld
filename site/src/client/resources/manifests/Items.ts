import { Item, ItemType } from "../../types/TypesItem";
import { Sprites } from "./Types";

const ITEM_BROWN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BROWN_SHELL_FRAGMENT,
    id: 1,
    stackable: true,
    name: "Brown Shell fragment",
    behaviours: [
        {
            type: ItemType.CAN_BE_TRADED,
            price: 10,
        },
    ],
};

const ITEM_GREEN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_GREEN_SHELL_FRAGMENT,
    id: 2,
    stackable: true,
    name: "Green Shell fragment",
    behaviours: [
        {
            type: ItemType.CAN_BE_TRADED,
            price: 50,
        },
    ],
};

const ITEM_BLUE_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BLUE_SHELL_FRAGMENT,
    id: 3,
    stackable: true,
    name: "Blue Shell fragment",
    behaviours: [
        {
            type: ItemType.CAN_BE_TRADED,
            price: 200,
        },
    ],
};

const ITEM_MACATOR_INNARDS: Item = {
    spriteIcon: Sprites.ITEM_MACATOR_INNARDS,
    id: 4,
    stackable: true,
    name: "Macator Innards",
    behaviours: [],
};

export const GameItems = {
    ITEM_BROWN_SHELL_FRAGMENT,
    ITEM_GREEN_SHELL_FRAGMENT,
    ITEM_BLUE_SHELL_FRAGMENT,
    ITEM_MACATOR_INNARDS,
};
