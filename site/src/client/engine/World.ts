import { Entity } from "./Entity";
import { TestStateType, BaseState, TestEntityState } from "./State";
import { TestComponent } from "./components/TestComponent";
import { OtherTestComponent } from "./components/OtherTestComponent";



export function testFunction() {
    const componentA = new TestComponent();
    const componentB = new OtherTestComponent();
    const newEntitiy = new Entity<TestEntityState>(componentA, componentB);

    newEntitiy.update();

}


