import { WorldState } from "../state/world/WorldState";
import { RenderState } from "../state/render/RenderState";
import { drawWalls } from "./Walls";
import { drawSprites } from "./Sprite";
import { drawPlanes } from "./Planes";

export function createImage(renderState: RenderState, worldState: WorldState) {

    const {screen, depthBuffer} = renderState;

    drawPlanes(screen, depthBuffer, worldState.camera, worldState.map.planes);
    drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites);
    drawWalls(screen, depthBuffer, worldState.map, worldState.camera);

}



