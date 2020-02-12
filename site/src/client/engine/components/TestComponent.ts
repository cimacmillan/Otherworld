import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent, EntityEventType } from "../events/Event";
import { BaseState, TestState, TestStateType } from "../State";

export class TestComponent<T extends TestStateType> extends EntityComponent<T> {
    public init(entity: Entity<TestStateType>): void {
        entity.setState({toOther: true});
    }

    public update(entity: Entity<TestStateType>): void {

        if (state.toOther) {
            console.log("I am in a null state");
        }

    }

    public onEvent(entity: Entity<TestStateType>, event: GameEvent): void {
        
    }

    public onObservedEvent(entity: Entity<TestStateType>, event: GameEvent): void {

    }

}
