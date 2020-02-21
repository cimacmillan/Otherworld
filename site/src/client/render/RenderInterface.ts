import * as glm from "gl-matrix";
import { RenderState } from "../state/render/RenderState";

export interface Sprite {
    position: glm.vec2;
    size: glm.vec2;
    height: number;
}

export interface RenderItem {
    renderId: number;
}

export interface RenderInterface {
    createSprite: () => RenderItem;
    updateSprite: (ref: RenderItem, param: Partial<Sprite>) => void; 
    freeSprite: (ref: RenderItem) => void;

    init: (renderState: RenderState) => void;
    draw: (renderState: RenderState) => void;
}


