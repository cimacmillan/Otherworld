import { Actions, emptyActions } from "../../../Actions";
import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export interface SwitchComponents {
    [key: string]: EntityComponent<any>;
}

export class SwitchComponent<T> implements EntityComponent<T> {
    private newState: string;

    constructor(
        private components: SwitchComponents,
        private currentState: string,
        private getSwitch: (entity: Entity<T>) => string
    ) {
        this.newState = currentState;
    }

    public update(entity: Entity<T>) {
        if (this.newState !== this.currentState) {
            const currentStateCallback = this.components[this.currentState]
                ? this.components[this.currentState].getActions(entity)
                : {};
            const newStateCallback = this.components[this.newState]
                ? this.components[this.newState].getActions(entity)
                : {};

            currentStateCallback.onEntityDeleted &&
                currentStateCallback.onEntityDeleted();
            newStateCallback.onEntityCreated &&
                newStateCallback.onEntityCreated();

            this.currentState = this.newState;
        }
        const currentStateCallback = this.components[this.currentState];

        currentStateCallback &&
            currentStateCallback.update &&
            currentStateCallback.update(entity);
    }

    public getActions(entity: Entity<T>) {
        const subscriber = new FunctionEventSubscriber<Actions>(emptyActions);
        Object.keys(this.components).forEach((key) => {
            subscriber.subscribe(
                this.wrapActions(
                    this.components[key].getActions(entity),
                    key,
                    entity
                )
            );
        });

        const entityActions = subscriber.actions();
        return {
            ...entityActions,
            onStateTransition: (from: any, to: any) => {
                entityActions.onStateTransition &&
                    entityActions.onStateTransition(from, to);
                this.newState = this.getSwitch(entity);
            },
        };
    }

    private wrapActions(
        actions: Partial<Actions>,
        rightKey: string,
        entity: Entity<T>
    ): Partial<Actions> {
        const newActions: Partial<Actions> = {};
        Object.keys(actions).forEach((key) => {
            newActions[key as keyof Actions] = (...args: any[]) => {
                if (this.getSwitch(entity) === rightKey) {
                    const action = actions[key as keyof Actions];
                    (action as any)(...args);
                }
            };
        });
        return newActions;
    }
}
