import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import { Sprites, SpriteSheets } from "../../../resources/manifests/Sprites";
import {
    Floor,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export interface FloorState {
    floorState: {
        floor?: Floor;
    };
}

export type FloorStateType = FloorState;

export class FloorRenderComponent implements EntityComponent<FloorStateType> {
    private toRenderRef?: RenderItem;

    public getInitialState = (entity: Entity<FloorStateType>) => {
        const {
            textureCoordinate,
            pixelCoordinate,
        } = entity
            .getServiceLocator()
            .getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                Sprites.FLOOR
            );

        const floor: Floor = {
            startPos: [0, 0],
            endPos: [1, 1],
            height: 0,
            textureX: textureCoordinate.textureX,
            textureY: textureCoordinate.textureY,
            textureWidth:
                (Math.abs(1) *
                    textureCoordinate.textureWidth *
                    SCENERY_PIXEL_DENSITY) /
                pixelCoordinate.textureWidth,
            textureHeight:
                (Math.abs(1) *
                    textureCoordinate.textureHeight *
                    SCENERY_PIXEL_DENSITY) /
                pixelCoordinate.textureWidth,
            repeatWidth: textureCoordinate.textureWidth,
            repeatHeight: textureCoordinate.textureHeight,
        };
        return {
            floorState: {
                floor,
            },
        };
    };

    public onStateTransition(
        entity: Entity<FloorStateType>,
        from: FloorStateType,
        to: FloorStateType
    ) {
        if (from.floorState.floor !== to.floorState.floor) {
            entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.updateItem(
                    this.toRenderRef,
                    to.floorState.floor
                );
        }
        if (!from.floorState.floor && to.floorState.floor) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.createItem(to.floorState.floor);
        } else if (
            from.floorState.floor &&
            !to.floorState.floor &&
            this.toRenderRef
        ) {
            entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }

    public onCreate(entity: Entity<FloorStateType>): void {
        if (entity.getState().floorState.floor) {
            this.toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.createItem(
                    entity.getState().floorState.floor
                );
        }
    }

    public onDestroy(entity: Entity<FloorStateType>) {
        if (this.toRenderRef) {
            entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.freeItem(this.toRenderRef);
            this.toRenderRef = undefined;
        }
    }
}
