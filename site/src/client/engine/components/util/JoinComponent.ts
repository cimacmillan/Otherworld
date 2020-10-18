import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../state/State";

export function JoinComponent<T extends BaseState>(
    components: Array<EntityComponent<T>>
): EntityComponent<T> {
    return {
        update: (entity: Entity<T>) =>
            components.forEach(
                (component) => component.update && component.update(entity)
            ),
        onEvent: (entity: Entity<T>, event: GameEvent) =>
            components.forEach(
                (component) =>
                    component.onEvent && component.onEvent(entity, event)
            ),

        onStateTransition: (entity: Entity<T>, from: T, to: T) =>
            components.forEach(
                (component) =>
                    component.onStateTransition &&
                    component.onStateTransition(entity, from, to)
            ),
        onCreate: (entity: Entity<T>) =>
            components.forEach(
                (component) => component.onCreate && component.onCreate(entity)
            ),
        onDestroy: (entity: Entity<T>) =>
            components.forEach(
                (component) => component.onCreate && component.onCreate(entity)
            ),
    };
}
