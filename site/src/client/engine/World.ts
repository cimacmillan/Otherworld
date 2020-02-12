import { OtherTestComponent } from "./components/OtherTestComponent";
import { TestComponent } from "./components/TestComponent";
import { Entity } from "./Entity";
import { BaseState, TestEntityState } from "./State";

export function testFunction() {
    const componentA = new TestComponent();
    const componentB = new OtherTestComponent();
    const newEntitiy = new Entity<TestEntityState>(componentA, componentB);

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
