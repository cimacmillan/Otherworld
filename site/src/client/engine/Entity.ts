import { ServiceLocator } from "../services/ServiceLocator";
import { EntityComponent } from "./EntityComponent";
import { EntityEventType } from "./events/EntityEvents";
import { GameEvent } from "./events/Event";
import { BaseState } from "./state/State";

export class Entity<State extends BaseState> {
    private components: Array<EntityComponent<State>>;
    private newState: State;
    private shouldEmit: boolean = false;

    private initialised: boolean = false;
    private listeners: Array<Entity<BaseState>> = [];

    constructor(
        private serviceLocator: ServiceLocator,
        private state: State,
        ...components: Array<EntityComponent<State>>
    ) {
        this.components = components;
        this.newState = state;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].init && this.components[i].init(this);
        }
        this.initialised = true;
    }

    public getState() {
        return this.newState;
    }

    public attachListener(entity: Entity<BaseState>) {
        this.listeners.push(entity);
    }

    public removeListener(entity: Entity<BaseState>) {
        this.listeners.splice(this.listeners.indexOf(entity));
    }

    public update() {
        if (this.shouldEmit) {
            this.shouldEmit = false;
            this.emit({
                type: EntityEventType.STATE_TRANSITION,
                payload: {
                    from: this.state,
                    to: this.newState,
                },
            });
        }
        this.state = this.newState;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update && this.components[i].update(this);
        }
    }

    public setState(state: Partial<State>, withEvent: boolean = true) {
        this.newState = { ...this.newState, ...state };
        this.shouldEmit = this.shouldEmit || withEvent;
        // withEvent && console.log(this.newState, state);
    }

    public emit(event: GameEvent) {
        for (let x = 0; x < this.components.length; x++) {
            this.components[x].onEvent &&
                this.components[x].onEvent(this, event);

            // Helper so I don't repeat the same code
            switch (event.type) {
                case EntityEventType.STATE_TRANSITION:
                    this.components[x].onStateTransition &&
                        this.components[x].onStateTransition(
                            this,
                            event.payload.from as State,
                            event.payload.to as State
                        );
                    break;
                case EntityEventType.ENTITY_CREATED:
                    this.components[x].onCreate &&
                        this.components[x].onCreate(this);
                    break;
                case EntityEventType.ENTITY_DELETED:
                    this.components[x].onDestroy &&
                        this.components[x].onDestroy(this);
                    break;
            }
        }
        for (let x = 0; x < this.listeners.length; x++) {
            this.listeners[x].onObservedEvent &&
                this.listeners[x].onObservedEvent(event);
        }
    }

    public onObservedEvent(event: GameEvent) {
        for (let x = 0; x < this.components.length; x++) {
            this.components[x].onObservedEvent &&
                this.components[x].onObservedEvent(this, event);
        }
    }

    public emitGlobally(event: GameEvent) {
        this.serviceLocator.getWorld().emitOutOfWorld(event);
        for (let x = 0; x < this.listeners.length; x++) {
            this.listeners[x].onObservedEvent &&
                this.listeners[x].onObservedEvent(event);
        }
    }

    public getServiceLocator() {
        return this.serviceLocator;
    }
}
