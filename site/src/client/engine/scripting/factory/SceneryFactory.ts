import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import { Sprites, SpriteSheets } from "../../../resources/manifests/Sprites";
import { Floor } from "../../../services/render/types/RenderInterface";
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
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import {
    WallRenderComponent,
    WallState,
} from "../../components/core/WallRenderComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

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
    sprite: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0,
    collides: boolean = true
) {
    const initialState: WallState & BoundaryStateType = {
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallSprite: sprite,
        wallStart: start,
        wallEnd: end,
        wallHeight: height,
        wallOffset: offset,
    };

    return new Entity<WallState & BoundaryStateType>(
        undefined,
        serviceLocator,
        initialState,
        WallRenderComponent(),
        new BoundaryComponent()
    );
}

export function createStaticSprite(
    serviceLocator: ServiceLocator,
    sprite: Sprites,
    position: Vector2D,
    height: number,
    spriteWidth: number,
    spriteHeight: number
) {
    const initialState: SpriteRenderState = {
        yOffset: 0,
        position,
        height,
        radius: 0,
        angle: 0,
        sprite,
        spriteWidth,
        spriteHeight,
    };

    return new Entity<SpriteRenderState>(
        undefined,
        serviceLocator,
        initialState,
        SpriteRenderComponent()
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
