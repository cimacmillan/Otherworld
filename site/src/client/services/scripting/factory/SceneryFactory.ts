import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../../engine/components/core/BoundaryComponent";
import {
    FloorRenderComponent,
    FloorStateType,
} from "../../../engine/components/core/FloorRenderComponent";
import {
    SpriteRenderComponent,
    SpriteStateType,
} from "../../../engine/components/rendering/SpriteRenderComponent";
import {
    WallRenderComponent,
    WallStateType,
} from "../../../engine/components/rendering/WallRenderComponent";
import { Entity } from "../../../engine/Entity";
import { SpriteSheets } from "../../../resources/manifests/DefaultManifest";
import { Vector2D } from "../../../types";
import { Floor, Wall } from "../../render/types/RenderInterface";
import { ServiceLocator } from "../../ServiceLocator";

export function createStaticFloor(
    serviceLocator: ServiceLocator,
    spriteString: string,
    height: number,
    start: Vector2D,
    end: Vector2D
) {
    const {
        textureCoordinate,
        pixelCoordinate,
    } = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

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

    const initialState: FloorStateType = {
        floorState: {
            floor,
        },
        exists: false,
    };

    return new Entity<FloorStateType>(
        serviceLocator,
        initialState,
        new FloorRenderComponent()
    );
}

export function createStaticWall(
    serviceLocator: ServiceLocator,
    spriteString: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0,
    collides: boolean = true
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

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

    const initialState: WallStateType & BoundaryStateType = {
        exists: false,
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallState: {
            wall,
        },
    };

    return new Entity<WallStateType & BoundaryStateType>(
        serviceLocator,
        initialState,
        new WallRenderComponent(),
        new BoundaryComponent()
    );
}

export function createStaticSprite(
    serviceLocator: ServiceLocator,
    spriteString: string,
    position: Vector2D,
    height: number,
    spriteWidth: number,
    spriteHeight: number
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

    const initialState: SpriteStateType = {
        exists: true,
        position,
        height,
        radius: 0,
        angle: 0,
        shouldRender: true,
        textureCoordinate: sprite.textureCoordinate,
        spriteWidth,
        spriteHeight,
    };

    return new Entity<SpriteStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent()
    );
}
