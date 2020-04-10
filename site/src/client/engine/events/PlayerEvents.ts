interface PlayerAttack {
    type: PlayerEventType.PLAYER_ATTACK;
}

export enum PlayerEventType {
    PLAYER_ATTACK = "PLAYER_ATTACK",
}

export type PlayerEvents = PlayerAttack;
