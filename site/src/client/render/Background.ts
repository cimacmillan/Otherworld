import { DepthBuffer, ScreenBuffer } from ".";
import { Camera } from "../types";

export function drawBackground(screen: ScreenBuffer, depth_buffer: DepthBuffer, camera: Camera) {
    depth_buffer.reset();
    screen.reset();
}
