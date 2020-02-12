import { EntityComponent } from "./EntityComponent";
import { EntityEventType, GameEvent } from "./events/Event";
import { BaseState } from "./State";

export class Entity <State extends BaseState> {

    private state: State;
    private components: Array<EntityComponent<State>>;
    private initialised: boolean = false;

    constructor(...components: Array<EntityComponent<State>>) {
        this.components = components;
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].init(this);
        }
        this.initialised = true;
    }

    public update() {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].update(this);
        }
    }

    public setState(state: Partial<State>) {
        const newState = {...this.state, ...state};
        if (this.initialised) {
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

    public getState() {
        return this.state;
    }

    public emit(event: GameEvent) {
        // notify observers
    }

}
