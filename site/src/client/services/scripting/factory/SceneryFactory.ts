import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../../engine/components/physics/BoundaryComponent";
import {
    WallRenderComponent,
    WallStateType,
} from "../../../engine/components/rendering/WallRenderComponent";
import { Entity } from "../../../engine/Entity";
import { Vector2D } from "../../../types";
import { Wall } from "../../render/types/RenderInterface";
import { SpriteSheets } from "../../resources/manifests/Types";
import { ServiceLocator } from "../../ServiceLocator";

export function createStaticWall(
    serviceLocator: ServiceLocator,
    spriteString: number,
    start: Vector2D,
    end: Vector2D
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SCENERY].getSprite(spriteString);
    const wall: Wall = {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        startHeight: 1,
        endHeight: 1,
        startOffset: 0,
        endOffset: 0,
        textureX: sprite.textureCoordinate.textureX,
        textureY: sprite.textureCoordinate.textureY,
        textureWidth: Math.sqrt(
            Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
        ),
        textureHeight: sprite.textureCoordinate.textureHeight,
        repeatWidth: sprite.textureCoordinate.textureWidth,
        repeatHeight: sprite.textureCoordinate.textureHeight,
    };

    return new Entity<WallStateType & BoundaryStateType>(
        serviceLocator,
        new WallRenderComponent(wall),
        new BoundaryComponent({
            boundaryState: {
                boundary: {
                    start,
                    end,
                },
                collides: true,
            },
        })
    );
}
