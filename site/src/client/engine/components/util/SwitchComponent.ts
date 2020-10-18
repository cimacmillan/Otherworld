import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { BaseState } from "../../state/State";

export interface SwitchComponents {
    [key: string]: EntityComponent<any>;
}

export class SwitchComponent<T extends BaseState>
    implements EntityComponent<T> {
    private newState: string;

    constructor(
        private components: SwitchComponents,
        private currentState: string,
        private getSwitch: (entity: Entity<T>) => string
    ) {
        this.newState = currentState;
    }

    public onStateTransition(entity: Entity<T>, from: T, to: T) {
        const currentStateCallback = this.components[this.currentState];
        currentStateCallback &&
            currentStateCallback.onStateTransition &&
            currentStateCallback.onStateTransition(entity, from, to);
        this.newState = this.getSwitch(entity);
    }

    public update(entity: Entity<T>) {
        if (this.newState !== this.currentState) {
            const currentStateCallback = this.components[this.currentState];
            const newStateCallback = this.components[this.newState];

            currentStateCallback &&
                currentStateCallback.onDestroy &&
                currentStateCallback.onDestroy(entity);
            newStateCallback &&
                newStateCallback.onCreate &&
                newStateCallback.onCreate(entity);

            this.currentState = this.newState;
        }
        const currentStateCallback = this.components[this.currentState];

        currentStateCallback &&
            currentStateCallback.update &&
            currentStateCallback.update(entity);
    }

    public onCreate(entity: Entity<T>) {
        const currentState = this.components[this.currentState];
        currentState && currentState.onCreate && currentState.onCreate(entity);
    }

    public onDestroy(entity: Entity<T>) {
        const currentState = this.components[this.currentState];
        currentState &&
            currentState.onDestroy &&
            currentState.onDestroy(entity);
    }

    public onEvent(entity: Entity<T>, event: GameEvent) {
        const currentState = this.components[this.currentState];
        currentState &&
            currentState.onEvent &&
            currentState.onEvent(entity, event);
    }
}