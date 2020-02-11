import { State } from "./State";
import { Event, BaseEventType } from "./Event";

export class Entity <InferredState extends State>{

    private state: InferredState;

    public getState() {
        return this.state;
    }

    public setState(state: InferredState) {
        if (this.state !== state) {
            this.emit({
                type: BaseEventType.STATE_TRANSITION
            });
        }
        this.state = state;
    }

    public emit(event: Event) {
        // notify observers
    } 

}

