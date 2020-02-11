import { EntityComponent } from "../EntityComponent";
import { Entity } from "../Entity";
import { Event, BaseEventType } from "../Event";
import { BaseState, TestState, TestStateType, OtherTestStateType } from "../State";

export class OtherTestComponent<T extends OtherTestStateType> extends EntityComponent<T> {

    public init(entity: Entity<OtherTestStateType>): void {
        entity.setState({another: true});
    }

    public update(entity: Entity<OtherTestStateType>): void {
        const state = entity.getState();

        if (state.another) {
            console.log("I am in another state");
        }
    }    
    
    public onEvent(entity: Entity<OtherTestStateType>, event: Event): void {
        if (event.type === BaseEventType.CREATED) {
            setTimeout(() => entity.emit(
                {
                    type: BaseEventType.DELETE
                }
            ));
        }
    }

    public onObservedEvent(entity: Entity<OtherTestStateType>, action: Event): void {

    }

}
