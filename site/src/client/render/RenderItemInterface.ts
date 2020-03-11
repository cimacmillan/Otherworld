import * as glm from "gl-matrix";
import { RenderState } from "../state/render/RenderState";
import { RenderInterface } from "./RenderInterface";

export interface RenderItem {
    renderId: number;
}

export interface RenderItemInterface<T> extends RenderInterface {
    createItem: (param: T) => RenderItem;
    updateItem: (ref: RenderItem, param: Partial<T>) => void; 
    freeItem: (ref: RenderItem) => void;

    init: (renderState: RenderState) => void;
    draw: (renderState: RenderState) => void;
}


