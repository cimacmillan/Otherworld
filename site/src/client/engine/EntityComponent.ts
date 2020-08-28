import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";
import { BaseState } from "./state/State";

export enum EntityComponentType {
    PhysicsComponent = "PhysicsComponent",
    InteractionComponent = "InteractionComponent",
    BoundaryComponent = "BoundaryComponent",

    FloorRenderComponent = "FloorRenderComponent",
    SpriteRenderComponent = "SpriteRenderComponent",
    WallRenderComponent = "WallRenderComponent",

    PlayerInventoryComponent = "PlayerInventoryComponent",
    PlayerControlComponent = "PlayerControlComponent",
    ItemDropComponent = "ItemDropComponent",

    EggLogicComponent = "EggLogicComponent",
    MacatorLogicComponent = "MacatorLogicComponent",
    MacatorRenderComponent = "MacatorRenderComponent",

    ChickenLogicComponent = "ChickenLogicComponent",
    ChickenRenderComponent = "ChickenRenderComponent",
}

export interface EntityComponent<State extends BaseState> {
    init?: (entity: Entity<State>) => void;
    update?: (entity: Entity<State>) => void;

    // On event from other components in this entitiy
    onEvent?: (entity: Entity<State>, event: GameEvent) => void;

    // On event from other entities / sources
    onObservedEvent?: (entity: Entity<State>, event: GameEvent) => void;

    onStateTransition?: (entity: Entity<State>, from: State, to: State) => void;
    onCreate?: (entity: Entity<State>) => void;
    onDestroy?: (entity: Entity<State>) => void;

    componentType: EntityComponentType;
}
