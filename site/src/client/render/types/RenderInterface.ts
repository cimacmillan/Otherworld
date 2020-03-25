import * as glm from "gl-matrix";
import { RenderState } from "../../state/render/RenderState";

export interface Sprite {
  position: glm.vec2;
  size: glm.vec2;
  height: number;

  textureX: number;
  textureY: number;
  textureWidth: number;
  textureHeight: number;
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

export interface RenderItem {
  renderId: number;
}

export interface RenderInterface {
  init: (renderState: RenderState) => void;
  draw: (renderState: RenderState) => void;
}
