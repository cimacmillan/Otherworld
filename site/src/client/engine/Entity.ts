import { ServiceLocator } from "../services/ServiceLocator";
import { EntityComponent } from "./EntityComponent";
import { EntityEventType } from "./events/EntityEvents";
import { GameEvent } from "./events/Event";
import { BaseState } from "./State";

export class Entity<State extends BaseState> {
    private state: State;
    private components: Array<EntityComponent<State>>;

    private initialised: boolean = false;
    private listeners: Array<Entity<BaseState>> = [];

    constructor(
        private serviceLocator: ServiceLocator,
        ...components: Array<EntityComponent<State>>
    ) {
        this.components = components;
        let initialState = {};
        for (let i = 0; i < this.components.length; i++) {
            initialState = {
                ...initialState,
                ...this.components[i].init(this),
            };
        }
        this.state = initialState as State;
        this.initialised = true;
    }

    public getState() {
        return this.state;
    }

    public attachListener(entity: Entity<BaseState>) {
        this.listeners.push(entity);
    }

    public removeListener(entity: Entity<BaseState>) {
        this.listeners.splice(this.listeners.indexOf(entity));
    }

    public update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update(this);
        }
    }

    public setState(state: Partial<State>, withEvent?: boolean) {
        const newState = { ...this.state, ...state };
        if (this.initialised && withEvent) {
            this.emit({
                type: EntityEventType.STATE_TRANSITION,
                payload: {
                    from: this.state,
                    to: newState,
                },
            });
        }
        this.state = newState;
    }

    public emit(event: GameEvent) {
        for (let x = 0; x < this.components.length; x++) {
            this.components[x].onEvent(this, event);
        }
        for (let x = 0; x < this.listeners.length; x++) {
            this.listeners[x].onObservedEvent(event);
        }
    }

    public onObservedEvent(event: GameEvent) {
        for (let x = 0; x < this.components.length; x++) {
            this.components[x].onObservedEvent(this, event);
        }
    }

    public emitGlobally(event: GameEvent) {
        this.serviceLocator.getWorld().emitOutOfWorld(event);
    }

    public getServiceLocator() {
        return this.serviceLocator;
    }
}
