import {
    Floor,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState } from "../../state/State";

export interface FloorState {
    floorState: {
        floor?: Floor;
    };
}

export type FloorStateType = BaseState & FloorState;

export class FloorRenderComponent<T extends FloorStateType>
    implements EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public update(entity: Entity<FloorStateType>): void {
        const { floor } = entity.getState().floorState;
        if (floor) {
            entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.updateItem(this.toRenderRef, floor);
        }
    }

    public onStateTransition(
        entity: Entity<FloorStateType>,
        from: FloorStateType,
        to: FloorStateType
    ) {
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