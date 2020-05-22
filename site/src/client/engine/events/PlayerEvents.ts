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

export enum PlayerEventType {
    PLAYER_ATTACK = "PLAYER_ATTACK",
    PLAYER_DAMAGED = "PLAYER_DAMAGED",
    PLAYER_KILLED = "PLAYER_KILLED",
    PLAYER_INFO_CHANGE = "PLAYER_INFO_CHANGE",
    PLAYER_ITEM_DROP_COLLECTED = "PLAYER_ITEM_DROP_COLLECTED",
}

export type PlayerEvents =
    | PlayerAttack
    | PlayerDamaged
    | PlayerKilled
    | PlayerInfoChange
    | PlayerItemDropCollected;
