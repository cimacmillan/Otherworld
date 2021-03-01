import { Actions, emptyActions } from "../../../Actions";
import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export function JoinComponent<T>(
    components: Array<EntityComponent<Partial<T>>>
): EntityComponent<T> {
    const subscriber = new FunctionEventSubscriber<Actions>(emptyActions);
    let initialised = false;
    return {
        update: (entity: Entity<T>) =>
            components.forEach(
                (component) => component.update && component.update(entity)
            ),
        getActions: (entity: Entity<T>) => {
            if (!initialised) {
                initialised = true;
                components.forEach((component) =>
                    subscriber.subscribe(component.getActions(entity))
                );
            }
            return subscriber.actions();
        },
    };
}
