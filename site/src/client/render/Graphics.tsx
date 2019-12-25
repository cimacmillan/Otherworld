import { WorldState } from "../state/world/WorldState";
import { RenderState } from "../state/render/RenderState";
import { drawWalls } from "./Walls";
import { drawSprites } from "./Sprite";

export function createImage(renderState: RenderState, worldState: WorldState) {

    const {screen, depthBuffer} = renderState;

    depthBuffer.reset();
    screen.reset();

    drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites);
    drawWalls(screen, depthBuffer, worldState.map, worldState.camera);

}



