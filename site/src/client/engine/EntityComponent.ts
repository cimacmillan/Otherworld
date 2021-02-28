import { Actions } from "../Actions";
import { Entity } from "./Entity";

export interface EntityComponent<State> {
    update?: (entity: Entity<State>) => void;
    getActions: (entity: Entity<State>) => Partial<Actions>;
}
