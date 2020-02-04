import { DepthBuffer, ScreenBuffer } from ".";
import { Camera, Colour } from "../types";

export function drawBackground(screen: ScreenBuffer, depth_buffer: DepthBuffer, colour: Colour) {
    depth_buffer.reset();
    screen.reset(colour);
}
