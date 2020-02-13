import { OtherTestComponent, OtherTestStateType } from "./components/OtherTestComponent";
import { TestComponent, TestStateType } from "./components/TestComponent";
import { Entity } from "./Entity";
import { BaseState, TestEntityState } from "./State";
import { GameEvent } from "./events/Event";

export class World {

    public init() {

    }

    public update() {

    }

    public addEntity(entity: Entity<BaseState>, force?: boolean) {

    }

    public removeEntity(entity: Entity<BaseState>, force?: boolean) {

    }

    // TOOD add global observer type
    public addGlobalObserver() {

    }

    public onGlobalEmit(event: GameEvent) {

    }
}

export function testFunction() {
    const componentA = new TestComponent();
    const componentB = new OtherTestComponent();
    const newEntitiy = new Entity<TestStateType & OtherTestStateType>(componentA, componentB);

    const componentA2 = new TestComponent();
    const componentB2 = new OtherTestComponent();
    const newEntitiy2 = new Entity<TestEntityState>(componentA, componentB);


    newEntitiy.attachListener(newEntitiy2);

    newEntitiy.update();

    const entityArray: Array<Entity<BaseState>> = [
        newEntitiy,
    ];

    entityArray.forEach((entity) => {
        entity.setState({exists: true});
    });

}
