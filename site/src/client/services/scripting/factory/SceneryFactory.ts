import { Vector2D } from "../../../types";
import { getTextureCoordinate } from "../../../util/math";
import { ServiceLocator } from "../../ServiceLocator";

export function createWall(
    serviceLocator: ServiceLocator,
    start: Vector2D,
    end: Vector2D
) {
    const wallTexture = getTextureCoordinate(32, 64, 32, 32, 0, 0);
    serviceLocator.getRenderService().wallRenderService.createItem({
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        startHeight: 1,
        endHeight: 1,
        startOffset: 0,
        endOffset: 0,
        textureX: wallTexture.textureX,
        textureY: wallTexture.textureY,
        textureWidth: Math.sqrt(
            Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
        ),
        textureHeight: wallTexture.textureHeight,
        repeatWidth: wallTexture.textureWidth,
        repeatHeight: wallTexture.textureHeight,
    });
    serviceLocator.getPhysicsService().registerBoundary({
        start,
        end,
    });
}
