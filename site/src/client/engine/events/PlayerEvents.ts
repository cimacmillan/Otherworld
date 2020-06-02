import { Item } from "../../services/scripting/items/types";

interface PlayerAttack {
    type: PlayerEventType.PLAYER_ATTACK;
}

interface PlayerDamaged {
    type: PlayerEventType.PLAYER_DAMAGED;
}

interface PlayerKilled {
    type: PlayerEventType.PLAYER_KILLED;
}

interface PlayerInfoChange {
    type: PlayerEventType.PLAYER_INFO_CHANGE;
}

interface PlayerItemDropCollected {
    type: PlayerEventType.PLAYER_ITEM_DROP_COLLECTED;
    payload: {
        item: Item;
    };
}

interface PlayerItemUsed {
    type: PlayerEventType.PLAYER_ITEM_USED;
    payload: {
        item: Item;
    };
}

interface PlayerHealed {
    type: PlayerEventType.PLAYER_HEALED;
    payload: {
        amount: number;
    };
}

interface PlayerInventoryOpened {
    type: PlayerEventType.PLAYER_INVENTORY_OPENED;
}

interface PlayerInventoryClosed {
    type: PlayerEventType.PLAYER_INVENTORY_CLOSED;
}

export enum PlayerEventType {
    PLAYER_ATTACK = "PLAYER_ATTACK",
    PLAYER_DAMAGED = "PLAYER_DAMAGED",
    PLAYER_HEALED = "PLAYER_HEALED",
    PLAYER_KILLED = "PLAYER_KILLED",
    PLAYER_INFO_CHANGE = "PLAYER_INFO_CHANGE",

    PLAYER_ITEM_DROP_COLLECTED = "PLAYER_ITEM_DROP_COLLECTED",
    PLAYER_ITEM_USED = "PLAYER_ITEM_USED",

    PLAYER_INVENTORY_OPENED = "PLAYER_INVENTORY_OPENED",
    PLAYER_INVENTORY_CLOSED = "PLAYER_INVENTORY_CLOSED",
}

export type PlayerEvents =
    | PlayerAttack
    | PlayerDamaged
    | PlayerKilled
    | PlayerHealed
    | PlayerInfoChange
    | PlayerItemDropCollected
    | PlayerItemUsed
    | PlayerInventoryOpened
    | PlayerInventoryClosed;
