import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";
import { BaseState } from "./State";

export abstract class EntityComponent<State extends BaseState> {
    // Should intialise this components part of the state
    public abstract init(entity: Entity<State>): void;
    // Update component
    public abstract update(entity: Entity<State>): void;
    // On event from other components in this entitiy
    public abstract onEvent(entity: Entity<State>, action: GameEvent): void;
    // On event from other entities
    public abstract onObservedEvent(entity: Entity<State>, action: GameEvent): void;
}
