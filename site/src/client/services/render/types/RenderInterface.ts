import * as glm from "gl-matrix";
import { TextureCoordinate } from "../../../resources/SpriteSheet";

export interface Sprite {
    position: glm.vec2;
    size: glm.vec2;
    height: number;

    texture: TextureCoordinate;
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
