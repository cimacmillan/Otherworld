import { Event } from "./Event";
import { Entity } from "./Entity";

export abstract class EntityComponent {

    public abstract update(entity: Entity): void;

    public abstract onEvent(entity: Entity, action: Event): void;
    public abstract onObservedEvent(entity: Entity, action: Event): void;
    
}

