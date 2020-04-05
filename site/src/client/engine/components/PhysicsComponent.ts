import { RenderItem } from "../../render/types/RenderInterface";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState, SurfacePositionState } from "../State";

export interface PhysicsState {}

export type PhysicsStateType = BaseState & SurfacePositionState & PhysicsState;

export class PhysicsComponent<
    T extends PhysicsStateType
> extends EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public init(entity: Entity<PhysicsStateType>) {
        return {};
    }

    public update(entity: Entity<PhysicsStateType>): void {}

    public onEvent(entity: Entity<PhysicsStateType>, event: GameEvent): void {}

    public onObservedEvent(
        entity: Entity<PhysicsStateType>,
        event: GameEvent
    ): void {}
}
