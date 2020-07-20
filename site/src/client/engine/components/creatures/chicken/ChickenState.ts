import { BaseState, SpriteRenderState } from "../../../state/State";
import { PhysicsStateType } from "../../physics/PhysicsComponent";

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

export type ChickenStateType = ChickenState &
    BaseState &
    SpriteRenderState &
    PhysicsStateType;

/**
 * SITTING = Transitioning to sitting
 * SITTING_IDLE = Sitting but not sleeping
 */
