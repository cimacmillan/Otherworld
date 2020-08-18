import { Vector2D } from "../../../../types";
import { BaseState, SpriteRenderState } from "../../../state/State";
import { PhysicsStateType } from "../../physics/PhysicsComponent";

export interface ChickenState {
    chickenState: ChickenNodes;
}

export interface ChickenNode {
    logicState: ChickenLogicState;
}

export type ChickenNodes = ChickenWalkingState | ChickenStandingState;

export interface ChickenWalkingState extends ChickenNode {
    logicState: ChickenLogicState.WALKING;
    destination: Vector2D;
}

export interface ChickenStandingState extends ChickenNode {
    logicState: ChickenLogicState.STANDING_IDLE;
    cooldown: number;
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
