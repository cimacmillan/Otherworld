import { BaseState } from "./State";
import { Event, BaseEventType } from "./Event";
import { EntityComponent } from "./EntityComponent";

export class Entity <State extends BaseState>{

    private state: State;
    private components: EntityComponent<State>[];
    private initialised: boolean = false;

    constructor(...components: EntityComponent<State>[]) {
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
        this.state = {...this.state, ...state};

        if(!this.initialised) {
            return;
        }
        
        if (this.state !== state) {
            this.emit({
                type: BaseEventType.STATE_TRANSITION
            });
        }
    }

    public getState() {
        return this.state;
    }

    public emit(event: Event) {
        // notify observers
    } 

}

