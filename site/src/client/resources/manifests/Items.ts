import { Item, ItemCategory } from "../../engine/scripting/items/types";
import { Sprites } from "./Sprites";

// const ITEM_GREEN_SHELL_FRAGMENT: Item = {
//     spriteIcon: Sprites.ITEM_GREEN_SHELL_FRAGMENT,
//     id: 2,
//     stackable: true,
//     name: "Green Shell Fragment",
//     behaviours: [],
//     value: 50,
//     category: ItemCategory.CRAFTING,
//     description:
//         "Fragment from a macator's shell. It has a matte green colour.",
// };

// const ITEM_BLUE_SHELL_FRAGMENT: Item = {
//     spriteIcon: Sprites.ITEM_BLUE_SHELL_FRAGMENT,
//     id: 3,
//     stackable: true,
//     name: "Blue Shell Fragment",
//     behaviours: [],
//     value: 200,
//     category: ItemCategory.CRAFTING,
//     description: "Fragment from a macator's shell. It has a shiny blue colour.",
// };

// const ITEM_MACATOR_INNARDS: Item = {
//     spriteIcon: Sprites.ITEM_MACATOR_INNARDS,
//     id: 4,
//     stackable: true,
//     name: "Macator Innards",
//     behaviours: [
//         {
//             type: ItemComponentType.HEALS_PLAYER,
//             amount: 0.1,
//         },
//         {
//             type: ItemComponentType.MAKES_NOISE_WHEN_CONSUMED,
//         },
//     ],
//     category: ItemCategory.CONSUMABLE,
//     description: "It smells funny.",
// };

// const GOLD: Item = {
//     spriteIcon: Sprites.ITEM_GOLD,
//     id: 5,
//     stackable: true,
//     name: "Gold",
//     behaviours: [],
//     category: ItemCategory.PRECIOUS,
//     description: "Shiny gold",
// };

// export const GameItems = {
//     // ITEM_BROWN_SHELL_FRAGMENT,
//     // ITEM_GREEN_SHELL_FRAGMENT,
//     // ITEM_BLUE_SHELL_FRAGMENT,
//     // ITEM_MACATOR_INNARDS,
//     // GOLD,
// };

export enum GameItem {
    "GOLD_KEY",
}

export type GameItemMap = {
    [key in GameItem]: Item;
};

export const GameItems: GameItemMap = {
    [GameItem.GOLD_KEY]: {
        id: GameItem.GOLD_KEY,
        spriteIcon: Sprites.ITEM_KEY,
        stackable: false,
        name: "Gold Key",
        behaviours: [],
        category: ItemCategory.KEY,
        description: "I wonder what it unlocks",
    },
};
