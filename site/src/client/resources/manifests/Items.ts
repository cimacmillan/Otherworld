import { Item } from "../../types/TypesItem";
import { Sprites } from "./Types";

const ITEM_SHELL_FRAGMENT: Item = {
    spriteIcon: Sprites.ITEM_SHELL_FRAGMENT,
    id: 1,
    stackable: true,
    name: "Shell fragment",
};

export const GameItems = {
    ITEM_SHELL_FRAGMENT,
};
