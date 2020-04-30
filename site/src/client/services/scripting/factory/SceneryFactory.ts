import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../../engine/components/physics/BoundaryComponent";
import {
    FloorRenderComponent,
    FloorStateType,
} from "../../../engine/components/rendering/FloorRenderComponent";
import {
    WallRenderComponent,
    WallStateType,
} from "../../../engine/components/rendering/WallRenderComponent";
import { Entity } from "../../../engine/Entity";
import { Vector2D } from "../../../types";
import { Floor, Wall } from "../../render/types/RenderInterface";
import { SpriteSheets } from "../../resources/manifests/Types";
import { ServiceLocator } from "../../ServiceLocator";

export function createStaticFloor(
    serviceLocator: ServiceLocator,
    spriteString: number,
    start: Vector2D,
    end: Vector2D
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SCENERY].getSprite(spriteString)
        .textureCoordinate;

    const floor: Floor = {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        height: 0,
        textureX: sprite.textureX,
        textureY: sprite.textureY,
        textureWidth: Math.abs(end.x - start.x),
        textureHeight: Math.abs(end.y - start.y),
        repeatWidth: sprite.textureWidth,
        repeatHeight: sprite.textureHeight,
    };

    return new Entity<FloorStateType>(
        serviceLocator,
        new FloorRenderComponent({
            floorState: {
                floor,
            },
        })
    );
}

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
