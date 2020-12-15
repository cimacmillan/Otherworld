import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import { SpriteSheets } from "../../../resources/manifests/Resources";
import { Floor, Wall } from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../components/core/BoundaryComponent";
import {
    FloorRenderComponent,
    FloorStateType,
} from "../../components/core/FloorRenderComponent";
import {
    SpriteRenderComponent,
    SpriteStateType,
} from "../../components/core/SpriteRenderComponent";
import {
    WallRenderComponent,
    WallStateType,
} from "../../components/core/WallRenderComponent";
import { Entity } from "../../Entity";

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
        undefined,
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
    const wall = createWallType(
        serviceLocator,
        spriteString,
        start,
        end,
        height,
        offset
    );

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
        undefined,
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
        yOffset: 0,
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
        undefined,
        serviceLocator,
        initialState,
        new SpriteRenderComponent()
    );
}

export const createBlock = (
    serviceLocator: ServiceLocator,
    x: number,
    y: number,
    sprite: string
) => {
    const vec1 = { x, y };
    const vec2 = { x: x + 1, y };
    const vec3 = { x: x + 1, y: y + 1 };
    const vec4 = { x, y: y + 1 };
    return [
        createStaticWall(serviceLocator, sprite, vec1, vec2),
        createStaticWall(serviceLocator, sprite, vec2, vec3),
        createStaticWall(serviceLocator, sprite, vec3, vec4),
        createStaticWall(serviceLocator, sprite, vec4, vec1),
    ];
};

export const createWallType = (
    serviceLocator: ServiceLocator,
    spriteString: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0
): Wall => {
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

    return {
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
};
