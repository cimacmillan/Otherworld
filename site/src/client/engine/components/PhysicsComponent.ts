import { Vector2D } from "../../types";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { BaseState, SurfacePositionState } from "../State";

export interface PhysicsState {
    velocity: Vector2D;
    friction: number;
    mass: number;
    collides: boolean;
    elastic: number;
}

export type PhysicsStateType = BaseState & SurfacePositionState & PhysicsState;

export class PhysicsComponent<
    T extends PhysicsStateType
> extends EntityComponent<T> {
    public init(entity: Entity<PhysicsStateType>) {
        return {};
    }

    public update(entity: Entity<PhysicsStateType>): void {}

    public onEvent(entity: Entity<PhysicsStateType>, event: GameEvent): void {
        switch (event.type) {
            case EntityEventType.STATE_TRANSITION:
                this.onStateTransition(
                    entity,
                    event.payload.from as PhysicsStateType,
                    event.payload.to as PhysicsStateType
                );
                break;
            case EntityEventType.ENTITY_DELETED:
                this.onDeleted(entity);
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

    private onDeleted(entity: Entity<PhysicsStateType>) {
        entity
            .getServiceLocator()
            .getPhysicsService()
            .unregisterPhysicsEntity(entity);
    }
}
