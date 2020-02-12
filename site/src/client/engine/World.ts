import { OtherTestComponent } from "./components/OtherTestComponent";
import { TestComponent } from "./components/TestComponent";
import { Entity } from "./Entity";
import { BaseState, TestEntityState, TestStateType } from "./State";

export function testFunction() {
    const componentA = new TestComponent();
    const componentB = new OtherTestComponent();
    const newEntitiy = new Entity<TestEntityState>(componentA, componentB);

    newEntitiy.update();

    const entityArray: Array<Entity<BaseState>> = [
        newEntitiy,
    ];

    entityArray.forEach((entity) => {
        entity.setState({exists: true});
    });

}
