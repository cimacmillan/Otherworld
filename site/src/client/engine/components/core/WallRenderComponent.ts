import { SpriteSheets } from "../../../resources/manifests/Sprites";
import {
    RenderItem,
    Wall,
} from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export interface WallState {
    wallSprite: string;
    wallStart: Vector2D;
    wallEnd: Vector2D;
    wallHeight?: number;
    wallOffset?: number;
}

export const WallRenderComponent = (): EntityComponent<WallState> => {
    let toRenderRef: RenderItem;
    return {
        onCreate: (entity: Entity<WallState>) => {
            const {
                wallSprite,
                wallStart,
                wallEnd,
                wallHeight,
                wallOffset,
            } = entity.getState();
            const wall = createWallType(
                entity.getServiceLocator(),
                wallSprite,
                wallStart,
                wallEnd,
                wallHeight,
                wallOffset
            );
            toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.createItem(wall);
        },
        update: (entity: Entity<WallState>) => {
            const {
                wallSprite,
                wallStart,
                wallEnd,
                wallHeight,
                wallOffset,
            } = entity.getState();
            const wall = createWallType(
                entity.getServiceLocator(),
                wallSprite,
                wallStart,
                wallEnd,
                wallHeight,
                wallOffset
            );
            entity
                .getServiceLocator()
                .getRenderService()
                .wallRenderService.updateItem(toRenderRef, wall);
        },
        onDestroy: (entity: Entity<WallState>) => {
            if (toRenderRef) {
                entity
                    .getServiceLocator()
                    .getRenderService()
                    .wallRenderService.freeItem(toRenderRef);
                toRenderRef = undefined;
            }
        },
    };
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

    const textureWidth = sprite.textureCoordinate.textureWidth;
    const textureHeight = sprite.textureCoordinate.textureHeight;

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
