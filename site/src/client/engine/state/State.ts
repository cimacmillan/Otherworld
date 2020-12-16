import { TextureCoordinate } from "../../resources/SpriteSheet";
import { SpriteShadeOverride } from "../../services/render/types/RenderInterface";
import { Camera, Vector2D } from "../../types";
import { Inventory } from "../scripting/items/types";

export interface SurfacePositionState {
    position: Vector2D;
    height: number;
    yOffset: number;
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
    shade?: SpriteShadeOverride;
}

export interface InventoryState {
    inventory: Inventory;
}
