import { Actions, emptyActions } from "../Actions";
import { ServiceLocator } from "../services/ServiceLocator";
import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { EntityComponent } from "./EntityComponent";
import { EntityType } from "./scripting/factory/EntityFactory";

export class Entity<State> {
    public type: EntityType = EntityType.NULL;
    private components: Array<EntityComponent<Partial<State>>>;
    private newState: State;
    private shouldEmit: boolean = false;
    private eventSubscriber = new FunctionEventSubscriber<Actions>(
        emptyActions
    );

    constructor(
        private serviceLocator: ServiceLocator,
        private state: State,
        ...components: Array<EntityComponent<Partial<State>>>
    ) {
        this.components = components;
        this.newState = state;
        components.forEach((component) =>
            this.eventSubscriber.subscribe(component.getActions(this))
        );
    }

    public withType(type: EntityType) {
        this.type = type;
        return this;
    }

    public getState() {
        return this.newState;
    }

    public update() {
        if (this.shouldEmit) {
            this.shouldEmit = false;
            this.getActions().onStateTransition(this.state, this.newState);
        }
        this.state = this.newState;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update && this.components[i].update(this);
        }
    }

    public setState(state: Partial<State>, withEvent: boolean = true) {
        this.newState = { ...this.newState, ...state };
        this.shouldEmit = this.shouldEmit || withEvent;
    }

    public getActions() {
        return this.eventSubscriber.actions();
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

    public create() {
        this.serviceLocator.getWorld().addEntity(this);
    }

    public getEventSubscriber() {
        return this.eventSubscriber;
    }
}
