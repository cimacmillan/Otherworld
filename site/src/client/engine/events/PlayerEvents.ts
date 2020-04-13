interface PlayerAttack {
    type: PlayerEventType.PLAYER_ATTACK;
}

interface PlayerDamaged {
    type: PlayerEventType.PLAYER_DAMAGED;
}

interface PlayerKilled {
    type: PlayerEventType.PLAYER_KILLED;
}

export enum PlayerEventType {
    PLAYER_ATTACK = "PLAYER_ATTACK",
    PLAYER_DAMAGED = "PLAYER_DAMAGED",
    PLAYER_KILLED = "PLAYER_KILLED",
}

export type PlayerEvents = PlayerAttack | PlayerDamaged | PlayerKilled;
