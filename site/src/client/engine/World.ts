import { Entity } from "./Entity";
import { GameEvent } from "./events/Event";
import { BaseState } from "./State";

export class World {
  public init() {}

  public update() {}

  public addEntity(entity: Entity<BaseState>, force?: boolean) {}

  public removeEntity(entity: Entity<BaseState>, force?: boolean) {}

  // TOOD add global observer type
  public addGlobalObserver() {}

  public onGlobalEmit(event: GameEvent) {}
}
