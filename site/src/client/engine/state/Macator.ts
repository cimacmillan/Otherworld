export enum MacatorState {
    WALKING = "WALKING",
    DAMAGED = "DAMAGED",
    DYING = "DYING",
    ATTACKING = "ATTACKING",
}

export enum EggState {
    IDLE = "IDLE",
    HATCHING = "HATCHING",
}

export interface EggLogicState {
    targetCount: number;
    currentLiving: number;
}
