import { ConsistentArray } from "../util/array/ConsistentArray";
import { Entity } from "./Entity";
import { EntityEventType } from "./events/EntityEvents";
import { GameEvent } from "./events/Event";

export class World {
    private entityArray: ConsistentArray<Entity<any>>;
    private worldDispatch: (event: GameEvent) => void;

    public constructor(worldDispatch: (event: GameEvent) => void) {
        this.worldDispatch = worldDispatch;
    }

    public init() {
        this.entityArray = new ConsistentArray<Entity<any>>();
    }

    public update() {
        const array = this.entityArray.getArray();
        for (let i = 0; i < array.length; i++) {
            array[i].update();
        }
    }

    public addEntity(entity: Entity<any>, force?: boolean) {
        this.entityArray.add(entity);
    }

    public removeEntity(entity: Entity<any>, force?: boolean) {
        this.entityArray.remove(entity);
    }

    public emitIntoWorld(event: GameEvent) {
        const entities = this.getEntityArray().getArray();
        for (let i = 0; i < entities.length; i++) {
            entities[i].emit(event);
        }
    }

    public emitOutOfWorld(event: GameEvent) {
        this.worldDispatch(event);
    }

    public getEntityArray() {
        return this.entityArray;
    }

    public performSync() {
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
