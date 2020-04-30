import {
    Floor,
    RenderItem,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../State";

export interface FloorState {
    floorState: {
        floor?: Floor;
    };
}

export type FloorStateType = BaseState & FloorState;

export class FloorRenderComponent<
    T extends FloorStateType
> extends EntityComponent<T> {
    private toRenderRef?: RenderItem;

    constructor(private initialState?: FloorState) {
        super();
    }

    public init(entity: Entity<FloorStateType>) {
        return this.initialState || {};
    }

    public update(entity: Entity<FloorStateType>): void {
        const { floor } = entity.getState().floorState;
        if (floor) {
            entity
                .getServiceLocator()
                .getRenderService()
                .floorRenderService.updateItem(this.toRenderRef, floor);
        }
    }

    public onEvent(entity: Entity<FloorStateType>, event: GameEvent): void {}

    public onObservedEvent(
        entity: Entity<FloorStateType>,
        event: GameEvent
    ): void {}

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
        if (this.initialState && !this.toRenderRef) {
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
