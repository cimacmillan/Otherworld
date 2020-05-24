import { Item, ItemComponentType, ItemCategory } from "../../services/scripting/items/types";
import { Sprites } from "./Types";

const ITEM_BROWN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BROWN_SHELL_FRAGMENT,
    id: 1,
    stackable: true,
    name: "Brown Shell fragment",
    behaviours: [],
    tradePrice: 10,
    category: ItemCategory.CRAFTING
};

const ITEM_GREEN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_GREEN_SHELL_FRAGMENT,
    id: 2,
    stackable: true,
    name: "Green Shell fragment",
    behaviours: [],
    tradePrice: 50,
    category: ItemCategory.CRAFTING
};

const ITEM_BLUE_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BLUE_SHELL_FRAGMENT,
    id: 3,
    stackable: true,
    name: "Blue Shell fragment",
    behaviours: [],
    tradePrice: 200,
    category: ItemCategory.CRAFTING
};

const ITEM_MACATOR_INNARDS: Item = {
    spriteIcon: Sprites.ITEM_MACATOR_INNARDS,
    id: 4,
    stackable: true,
    name: "Macator Innards",
    behaviours: [
        {
            type: ItemComponentType.HEALS_PLAYER,
            amount: 0.2,
        },
    ],
    category: ItemCategory.CONSUMABLE
};

export const GameItems = {
    ITEM_BROWN_SHELL_FRAGMENT,
    ITEM_GREEN_SHELL_FRAGMENT,
    ITEM_BLUE_SHELL_FRAGMENT,
    ITEM_MACATOR_INNARDS,
};
