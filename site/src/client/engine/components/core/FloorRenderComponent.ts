import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import { Sprites, SpriteSheets } from "../../../resources/manifests/Sprites";
import {
    Floor,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";

export interface FloorState {
    floorStart: Vector2D;
    floorEnd: Vector2D;
    floorSprite: string;
    floorHeight: number;
}

export type FloorStateType = FloorState;

export const FloorRenderComponent = () => {
    let toRenderRef: RenderItem;
    return {
        getInitialState: () => ({
            floorStart: { x: 0, y: 0 },
            floorEnd: { x: 1, y: 1 },
            floorSprite: Sprites.WALL,
            floorHeight: 0,
        }),
        onCreate: (entity: Entity<FloorStateType>) => {
            toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.createItem(getFloorObject(entity));
        },
        onDestroy: (entity: Entity<FloorStateType>) => {
            if (toRenderRef) {
                entity
                    .getServiceLocator()
                    .getRenderService()
                    .floorRenderService.freeItem(toRenderRef);
                toRenderRef = undefined;
            }
        },
    };
};

function getFloorObject(entity: Entity<FloorState>): Floor {
    const {
        floorStart,
        floorEnd,
        floorSprite,
        floorHeight,
    } = entity.getState();
    const {
        textureCoordinate,
        pixelCoordinate,
    } = entity
        .getServiceLocator()
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(floorSprite);
    return {
        startPos: [floorStart.x, floorStart.y],
        endPos: [floorEnd.x, floorEnd.y],
        height: floorHeight,
        textureX: textureCoordinate.textureX,
        textureY: textureCoordinate.textureY,
        textureWidth:
            (Math.abs(floorEnd.x - floorStart.x) *
                textureCoordinate.textureWidth *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        textureHeight:
            (Math.abs(floorEnd.y - floorStart.y) *
                textureCoordinate.textureHeight *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        repeatWidth: textureCoordinate.textureWidth,
        repeatHeight: textureCoordinate.textureHeight,
    };
}
