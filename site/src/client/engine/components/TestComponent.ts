import { EntityComponent } from "../EntityComponent";
import { Entity } from "../Entity";
import { GameEvent, BaseEventType } from "../events/Event";
import { BaseState, TestState, TestStateType } from "../State";

export class TestComponent<T extends TestStateType> extends EntityComponent<T> {
    public init(entity: Entity<TestStateType>): void {
        entity.setState({toOther: true});
    }

    public update(entity: Entity<TestStateType>): void {
        const state = entity.getState();

        if (state.toOther) {
            console.log("I am in a null state");
        }
    }    
    
    public onEvent(entity: Entity<TestStateType>, event: GameEvent): void {
        if (event.type === BaseEventType.CREATED) {
            setTimeout(() => entity.emit(
                {
                    type: BaseEventType.DELETE
                }
            ));
        }
    }

    public onObservedEvent(entity: Entity<TestStateType>, action: GameEvent): void {

    }

}
