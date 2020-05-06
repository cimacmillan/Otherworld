import { Camera, Vector2D } from "../../types";

export interface BaseState {
    exists: boolean;
}

export interface SurfacePositionState {
    position: Vector2D;
    height: number;
    radius: number;
    angle: number;
}

export interface CameraState {
    camera: Camera;
    cameraShouldSync: boolean;
}

export interface LogicState {
    logicState: string;
}

export interface HealthState {
    health: number;
}
