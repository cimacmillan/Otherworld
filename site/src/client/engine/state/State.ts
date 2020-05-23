import { TextureCoordinate } from "../../resources/SpriteSheet";
import { Inventory } from "../../services/scripting/items/types";
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

export interface SpriteRenderState extends SurfacePositionState {
    shouldRender: boolean;
    textureCoordinate: TextureCoordinate;
    spriteHeight: number;
    spriteWidth: number;
}

export interface InventoryState {
    inventory: Inventory;
}
