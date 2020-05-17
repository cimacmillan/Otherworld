import { Item } from "../../types/TypesItem";
import { Sprites } from "./Types";

const ITEM_BROWN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BROWN_SHELL_FRAGMENT,
    id: 1,
    stackable: true,
    name: "Brown Shell fragment",
};

const ITEM_GREEN_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_GREEN_SHELL_FRAGMENT,
    id: 2,
    stackable: true,
    name: "Green Shell fragment",
};

const ITEM_BLUE_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_BLUE_SHELL_FRAGMENT,
    id: 3,
    stackable: true,
    name: "Blue Shell fragment",
};

const ITEM_MACATOR_INNARDS: Item = {
    spriteIcon: Sprites.ITEM_MACATOR_INNARDS,
    id: 4,
    stackable: true,
    name: "Macator Innards",
};

export const GameItems = {
    ITEM_BROWN_SHELL_FRAGMENT,
    ITEM_GREEN_SHELL_FRAGMENT,
    ITEM_BLUE_SHELL_FRAGMENT,
    ITEM_MACATOR_INNARDS
};
