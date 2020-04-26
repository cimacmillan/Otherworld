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

export enum PlayerEventType {
    PLAYER_ATTACK = "PLAYER_ATTACK",
    PLAYER_DAMAGED = "PLAYER_DAMAGED",
    PLAYER_KILLED = "PLAYER_KILLED",
    PLAYER_INFO_CHANGE = "PLAYER_INFO_CHANGE",
}

export type PlayerEvents =
    | PlayerAttack
    | PlayerDamaged
    | PlayerKilled
    | PlayerInfoChange;
