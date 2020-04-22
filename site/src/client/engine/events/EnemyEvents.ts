interface EnemyKilled {
    type: EnemyEventType.ENEMY_KILLED;
}

export enum EnemyEventType {
    ENEMY_KILLED = "ENEMY_KILLED",
}

export type EnemyEvents = EnemyKilled;
