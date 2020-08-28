import { Vector2D } from "../../../../types";
import {
    BaseState,
    HealthState,
    SpriteRenderState,
    SurfacePositionState,
} from "../../../state/State";
import { InteractionState } from "../../InteractionComponent";
import { PhysicsStateType } from "../../physics/PhysicsComponent";

export interface ChickenState {
    chickenState: ChickenNodes;
}

export interface ChickenNode {
    logicState: ChickenLogicState;
}

export type ChickenNodes =
    | ChickenWalkingState
    | ChickenStandingState
    | ChickenHatchingState
    | ChickenDamagedState
    | ChickenRunningState;

export interface ChickenWalkingState extends ChickenNode {
    logicState: ChickenLogicState.WALKING;
    destination: Vector2D;
}

export interface ChickenStandingState extends ChickenNode {
    logicState: ChickenLogicState.STANDING_IDLE;
    cooldown: number;
}

export interface ChickenHatchingState extends ChickenNode {
    logicState: ChickenLogicState.HATCHING;
}

export interface ChickenDamagedState extends ChickenNode {
    logicState: ChickenLogicState.DAMAGED;
    source: SurfacePositionState;
}

export interface ChickenRunningState extends ChickenNode {
    logicState: ChickenLogicState.RUNNING_AWAY;
    destination: Vector2D;
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
    DAMAGED = "DAMAGED",
    RUNNING_AWAY = "RUNNING_AWAY",
}

export type ChickenStateType = ChickenState &
    BaseState &
    SpriteRenderState &
    PhysicsStateType &
    InteractionState &
    HealthState;

/**
 * SITTING = Transitioning to sitting
 * SITTING_IDLE = Sitting but not sleeping
 */
