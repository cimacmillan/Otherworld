import { mat4 } from "gl-matrix";
import { ScreenBuffer } from "../../render";
import { Camera } from "../../types";

export interface RenderState {
  screen: ScreenBuffer;
  camera: Camera;
}
