import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";

export function JoinComponent<T>(
    components: Array<EntityComponent<Partial<T>>>
): EntityComponent<T> {
    return {
        getInitialState: (entity: Entity<T>) => {
            let state = {} as T;
            components.forEach((component) => {
                if (!component.getInitialState) {
                    return;
                }
                state = { ...state, ...component.getInitialState(entity) };
            });
            return state;
        },
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
        onCreate: (entity: Entity<T>, wasEntityCreated?: boolean) =>
            components.forEach(
                (component) =>
                    component.onCreate &&
                    component.onCreate(entity, wasEntityCreated)
            ),
        onDestroy: (entity: Entity<T>) =>
            components.forEach(
                (component) =>
                    component.onDestroy && component.onDestroy(entity)
            ),
    };
}
