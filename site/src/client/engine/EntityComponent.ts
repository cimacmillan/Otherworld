import { ServiceLocator } from "../services/ServiceLocator";
import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";
import { BaseState } from "./State";

export abstract class EntityComponent<State extends BaseState> {
  // Should intialise this components part of the state
  public abstract init(entity: Entity<State>): object;
  // Update component
  public abstract update(entity: Entity<State>): void;
  // On event from other components in this entitiy
  public abstract onEvent(entity: Entity<State>, event: GameEvent): void;
  // On event from other entities
  public abstract onObservedEvent(
    entity: Entity<State>,
    event: GameEvent
  ): void;
}
