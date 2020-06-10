export enum MacatorState {
    WALKING = "WALKING",
    DAMAGED = "DAMAGED",
    DEAD = "DEAD",
    ATTACKING = "ATTACKING",
}

export enum MacatorType {
    BROWN,
    BLUE,
    GREEN,
}

export enum EggState {
    IDLE = "IDLE",
    HATCHING = "HATCHING",
}

export interface EggLogicState {
    logicState: EggState;
    targetCount: number;
    currentLiving: number;
}

export interface MacatorLogicState {
    macatorState: MacatorState;
    macatorType: MacatorType;
}
