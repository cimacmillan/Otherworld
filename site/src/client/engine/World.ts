import { ConsistentArray } from "../util/array/ConsistentArray";
import { Entity } from "./Entity";
import { EntityEventType } from "./events/EntityEvents";
import { GameEvent } from "./events/Event";
import { BaseState } from "./State";

export class World {
  private entityArray: ConsistentArray<Entity<BaseState>>;

  public init() {
    this.entityArray = new ConsistentArray<Entity<BaseState>>();
  }

  public update() {
    this.performSync();
    const array = this.entityArray.getArray();
    for (let i = 0; i < array.length; i++) {
      array[i].update();
    }
  }

  public addEntity(entity: Entity<BaseState>, force?: boolean) {
    this.entityArray.add(entity);
  }

  public removeEntity(entity: Entity<BaseState>, force?: boolean) {
    this.entityArray.remove(entity);
  }

  // TOOD add global observer type
  public addGlobalObserver() {}

  public onGlobalEmit(event: GameEvent) {}

  public getEntityArray() {
    return this.entityArray;
  }

  private performSync() {
    const toAdd = this.entityArray.getToAdd();
    const toRemove = this.entityArray.getToRemove();
    for (let i = 0; i < toAdd.length; i++) {
      toAdd[i].emit({
        type: EntityEventType.ENTITY_CREATED,
      });
    }

    for (let i = 0; i < toRemove.length; i++) {
      toRemove[i].emit({
        type: EntityEventType.ENTITY_DELETED,
      });
    }
    this.entityArray.sync();
  }
}
