import { RenderItem } from "../../services/render/types/RenderInterface";
import { Vector2D } from "../../types";
import { vec_add, vec_mult_scalar } from "../../util/math";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { PhysicsEventType } from "../events/PhysicsEvents";
import { BaseState, SurfacePositionState } from "../State";

export interface PhysicsState {
    velocity: Vector2D;
    friction: number;
    collides: boolean;
}

export type PhysicsStateType = BaseState & SurfacePositionState & PhysicsState;

export class PhysicsComponent<
    T extends PhysicsStateType
> extends EntityComponent<T> {
    private toRenderRef?: RenderItem;

    public init(entity: Entity<PhysicsStateType>) {
        return {};
    }

    public update(entity: Entity<PhysicsStateType>): void {
        const state = entity.getState();

        state.position = vec_add(state.position, state.velocity);
        state.velocity = vec_mult_scalar(state.velocity, state.friction);
    }

    public onEvent(entity: Entity<PhysicsStateType>, event: GameEvent): void {
        switch (event.type) {
            case EntityEventType.STATE_TRANSITION:
                this.onStateTransition(
                    entity,
                    event.payload.from as PhysicsStateType,
                    event.payload.to as PhysicsStateType
                );
                break;
            case PhysicsEventType.IMPULSE:
                entity.getState().velocity = vec_add(
                    entity.getState().velocity,
                    event.payload.velocity
                );
                break;
        }
    }

    public onObservedEvent(
        entity: Entity<PhysicsStateType>,
        event: GameEvent
    ): void {}

    private onStateTransition(
        entity: Entity<PhysicsStateType>,
        from: PhysicsStateType,
        to: PhysicsStateType
    ) {
        if (!from.collides && to.collides === true) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .registerPhysicsEntity(entity);
        }
        if (from.collides === true && !to.collides) {
            entity
                .getServiceLocator()
                .getPhysicsService()
                .unregisterPhysicsEntity(entity);
        }
    }
}
