import { TextureCoordinate } from "../../resources/SpriteSheet";
import { SpriteShadeOverride } from "../../services/render/types/RenderInterface";
import { Camera, Vector2D } from "../../types";
import { Inventory } from "../scripting/items/types";

export interface SurfacePosition {
    position: Vector2D;
    height: number;
    yOffset: number;
    radius: number;
    angle: number;
}

export const SUFRACE_POSITION_STATE_DEFAULT = {
    position: {
        x: 0,
        y: 0,
    },
    height: 0,
    yOffset: 0,
    radius: 1,
    angle: 0,
};

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

export interface SpriteRenderState extends SurfacePosition {
    textureCoordinate: TextureCoordinate;
    spriteHeight: number;
    spriteWidth: number;
    shade?: SpriteShadeOverride;
}

export const DEFAULT_SPRITE_RENDER_STATE: SpriteRenderState = {
    ...SUFRACE_POSITION_STATE_DEFAULT,
    textureCoordinate: {
        textureX: 0,
        textureY: 0,
        textureWidth: 1,
        textureHeight: 1,
    },
    spriteWidth: 1,
    spriteHeight: 1,
    shade: undefined,
};

export interface InventoryState {
    inventory: Inventory;
}
