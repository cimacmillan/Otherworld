import { EntityComponent } from "../EntityComponent";
import { Entity } from "../Entity";
import { Event, BaseEventType } from "../Event";
import { State } from "../State";

enum TestComponentStates {
    NULL = "NULL"
}

export type TestComponentState = TestComponentStates | State;

class TestComponent implements EntityComponent {

    public update(entity: Entity<TestComponentState>): void {
        const state = entity.getState();

        if (state === State.NULL) {
            console.log("I am in a null state");
        }
    }    
    
    public onEvent(entity: Entity, event: Event): void {
        if (event.type === BaseEventType.CREATED) {
            setTimeout(() => entity.emit(
                {
                    type: BaseEventType.DELETE
                }
            ));
        }
    }

    public onObservedEvent(entity: Entity, action: Event): void {

    }

}
