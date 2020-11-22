import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";
import { BaseState } from "./state/State";

export interface EntityComponent<State extends BaseState> {
    update?: (entity: Entity<State>) => void;
    onEvent?: (entity: Entity<State>, event: GameEvent) => void;

    onStateTransition?: (entity: Entity<State>, from: State, to: State) => void;
    onCreate?: (entity: Entity<State>) => void;
    onDestroy?: (entity: Entity<State>) => void;
}
