import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";

export interface EntityComponent<State> {
    update?: (entity: Entity<State>) => void;
    onEvent?: (entity: Entity<State>, event: GameEvent) => void;

    onStateTransition?: (entity: Entity<State>, from: State, to: State) => void;
    onCreate?: (entity: Entity<State>, wasEntityCreated?: boolean) => void;
    onDestroy?: (entity: Entity<State>) => void;
}
