import { SCENERY_PIXEL_DENSITY } from "../../../Config";
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
import { SpriteSheets } from "../../../resources/manifests/Types";
import { Vector2D } from "../../../types";
import { Floor, Wall } from "../../render/types/RenderInterface";
import { ServiceLocator } from "../../ServiceLocator";

export function createStaticFloor(
    serviceLocator: ServiceLocator,
    spriteString: number,
    height: number,
    start: Vector2D,
    end: Vector2D
) {
    const {
        textureCoordinate,
        pixelCoordinate,
    } = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SCENERY].getSprite(spriteString);

    const floor: Floor = {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        height,
        textureX: textureCoordinate.textureX,
        textureY: textureCoordinate.textureY,
        textureWidth:
            (Math.abs(end.x - start.x) *
                textureCoordinate.textureWidth *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        textureHeight:
            (Math.abs(end.y - start.y) *
                textureCoordinate.textureHeight *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        repeatWidth: textureCoordinate.textureWidth,
        repeatHeight: textureCoordinate.textureHeight,
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
    end: Vector2D,
    height: number = 1,
    offset: number = 0
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SCENERY].getSprite(spriteString);

    const textureWidth =
        (Math.sqrt(
            Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
        ) *
            sprite.textureCoordinate.textureWidth *
            SCENERY_PIXEL_DENSITY) /
        sprite.pixelCoordinate.textureWidth;
    const textureHeight =
        (sprite.textureCoordinate.textureHeight *
            height *
            SCENERY_PIXEL_DENSITY) /
        sprite.pixelCoordinate.textureHeight;

    const wall: Wall = {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        startHeight: height,
        endHeight: height,
        startOffset: offset,
        endOffset: offset,
        textureX: sprite.textureCoordinate.textureX,
        textureY: sprite.textureCoordinate.textureY,
        textureWidth,
        textureHeight,
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
