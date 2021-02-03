import { Sprites } from "../../../resources/manifests/Sprites";
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
import { EntityFactory } from "./EntityFactory";

export function createStaticFloorState(
    spriteString: string,
    height: number,
    start: Vector2D,
    end: Vector2D
) {
    return {
        floorStart: start,
        floorEnd: end,
        floorSprite: spriteString,
        floorHeight: height,
    };
}

export function createStaticFloor(
    serviceLocator: ServiceLocator,
    state: FloorStateType
) {
    return new Entity<FloorStateType>(
        serviceLocator,
        state,
        FloorRenderComponent()
    );
}

export function createStaticWallState(
    sprite: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0,
    collides: boolean = true
) {
    return {
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
}

export function createStaticWall(
    serviceLocator: ServiceLocator,
    state: WallState & BoundaryStateType
) {
    return new Entity<WallState & BoundaryStateType>(
        serviceLocator,
        state,
        WallRenderComponent(),
        new BoundaryComponent()
    );
}

export function createStaticSpriteState(
    sprite: Sprites,
    position: Vector2D,
    height: number,
    spriteWidth: number,
    spriteHeight: number
) {
    return {
        yOffset: 0,
        position,
        height,
        radius: 0,
        angle: 0,
        sprite,
        spriteWidth,
        spriteHeight,
    };
}

export function createStaticSprite(
    serviceLocator: ServiceLocator,
    state: SpriteRenderState
) {
    return new Entity<SpriteRenderState>(
        serviceLocator,
        state,
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
        EntityFactory.SCENERY_WALL(
            serviceLocator,
            createStaticWallState(sprite, vec1, vec2)
        ),
        EntityFactory.SCENERY_WALL(
            serviceLocator,
            createStaticWallState(sprite, vec2, vec3)
        ),
        EntityFactory.SCENERY_WALL(
            serviceLocator,
            createStaticWallState(sprite, vec3, vec4)
        ),
        EntityFactory.SCENERY_WALL(
            serviceLocator,
            createStaticWallState(sprite, vec4, vec1)
        ),
    ];
};
