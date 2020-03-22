import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { GameEvent } from "../events/Event";
import { BaseState } from "../State";

export interface OtherTestState {
  another: boolean;
}

export type OtherTestStateType = BaseState & OtherTestState;

export class OtherTestComponent<
  T extends OtherTestStateType
> extends EntityComponent<T> {
  public init(entity: Entity<OtherTestStateType>): void {
    entity.setState({ another: true });
  }

  public update(entity: Entity<OtherTestStateType>): void {
    const state = entity.getState();

    if (state.another) {
      console.log("I am in another state");
    }
  }

  public onEvent(entity: Entity<OtherTestStateType>, event: GameEvent): void {}

  public onObservedEvent(
    entity: Entity<OtherTestStateType>,
    action: GameEvent
  ): void {}
}
