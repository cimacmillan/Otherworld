import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState } from "../State";

export interface TestState {
    toOther: boolean;
}

export type TestStateType = BaseState & TestState;

export class TestComponent<T extends TestStateType> extends EntityComponent<T> {

    public init(entity: Entity<TestStateType>): void {
        entity.setState({toOther: true});
    }

    public update(entity: Entity<TestStateType>): void {

        if (entity.getState().toOther) {
            console.log("I am in a null state");
        }

    }

    public onEvent(entity: Entity<TestStateType>, event: GameEvent): void {
        
    }

    public onObservedEvent(entity: Entity<TestStateType>, event: GameEvent): void {

    }

}
