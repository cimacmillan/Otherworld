import { ScreenBuffer } from "../../render";
import { Camera } from "../../types";
import { mat4 } from "gl-matrix";

export interface RenderState {
    screen: ScreenBuffer;
    camera: Camera;
}
