export interface ChickenState {
    logicState: ChickenLogicState;
}

export enum ChickenLogicState {
    STANDING_IDLE = "STANDING_IDLE",
    SITTING_IDLE = "SITTING_IDLE",
    SITTING = "SITTING",
    SLEEPING = "SLEEPING",
    WALKING = "WALKING",
    JUMPING = "JUMPING",
    EATING = "EATING",
    HATCHING = "HATCHING",
}

/**
 * SITTING = Transitioning to sitting
 * SITTING_IDLE = Sitting but not sleeping
 */
