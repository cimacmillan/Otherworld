import { RenderState } from "../state/render/RenderState";
import { WorldState } from "../state/world/WorldState";
import { drawBackground } from "./Background";
import { drawPlanes } from "./Planes";
import { drawSprites } from "./Sprite";
import { drawWalls } from "./Walls";

export function createImage(renderState: RenderState, worldState: WorldState) {

    const {screen, depthBuffer} = renderState;

    drawBackground(screen, depthBuffer, worldState.map.backgroundColour);
    drawPlanes(screen, depthBuffer, worldState.camera, worldState.map.backgroundColour, worldState.map.floor, worldState.map.ceiling);
    drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites, worldState.map.backgroundColour);
    drawWalls(screen, depthBuffer, worldState.camera, worldState.map.wall_buffer, worldState.map.backgroundColour);

}
