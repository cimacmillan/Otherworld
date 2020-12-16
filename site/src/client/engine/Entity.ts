import { ServiceLocator } from "../services/ServiceLocator";
import { EntityComponent } from "./EntityComponent";
import { EntityEventType, StateTransitionEvent } from "./events/EntityEvents";
import { GameEvent } from "./events/Event";
import { EntitySerial } from "./scripting/factory/Serial";

export class Entity<State> {
    private components: Array<EntityComponent<State>>;
    private newState: State;
    private shouldEmit: boolean = false;

    constructor(
        public serial: EntitySerial = EntitySerial.NULL,
        private serviceLocator: ServiceLocator,
        private state: State,
        ...components: Array<EntityComponent<State>>
    ) {
        this.components = components;
        this.newState = state;
    }

    public getState() {
        return this.newState;
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
                    const transition = event as StateTransitionEvent<State>;
                    this.components[x].onStateTransition &&
                        this.components[x].onStateTransition(
                            this,
                            transition.payload.from as State,
                            transition.payload.to as State
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
    }

    public emitGlobally(event: GameEvent) {
        this.serviceLocator.getWorld().emitOutOfWorld(event);
    }

    public getServiceLocator() {
        return this.serviceLocator;
    }

    public getComponents() {
        return this.components;
    }

    public delete() {
        this.serviceLocator.getWorld().removeEntity(this);
    }
}
