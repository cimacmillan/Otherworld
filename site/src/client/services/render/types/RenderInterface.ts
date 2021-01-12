import * as glm from "gl-matrix";
import { TextureCoordinate } from "../../../resources/SpriteSheet";

export interface Sprite {
    position: glm.vec2;
    size: glm.vec2;
    height: number;

    texture: TextureCoordinate;
    shade: SpriteShadeOverride;
}

export interface ParticleRender {
    position: glm.vec3;
    size: glm.vec2;
    r: number;
    g: number;
    b: number;
}

export interface SpriteShadeOverride {
    r: number;
    g: number;
    b: number;
    intensity: number;
}

export interface Wall {
    startPos: glm.vec2;
    endPos: glm.vec2;

    startHeight: number;
    endHeight: number;

    startOffset: number;
    endOffset: number;

    textureX: number;
    textureY: number;
    textureWidth: number;
    textureHeight: number;

    repeatWidth: number;
    repeatHeight: number;
}

export interface Floor {
    startPos: glm.vec2;
    endPos: glm.vec2;

    height: number;

    textureX: number;
    textureY: number;
    textureWidth: number;
    textureHeight: number;

    repeatWidth: number;
    repeatHeight: number;
}

export interface RenderItem {
    renderId: number;
}

export interface RenderInterface {
    init: (gl: WebGLRenderingContext) => void;
    draw: () => void;
}
