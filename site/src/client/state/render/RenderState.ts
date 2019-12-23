import { DepthBuffer, ScreenBuffer } from "../../render";

export interface RenderState {
    screen: ScreenBuffer;
    depthBuffer: DepthBuffer;
}
