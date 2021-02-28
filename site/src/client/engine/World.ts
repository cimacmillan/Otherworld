import { ConsistentArray } from "../util/array/ConsistentArray";
import { Entity } from "./Entity";

export class World {
    private entityArray: ConsistentArray<Entity<any>>;

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

    public getEntityArray() {
        return this.entityArray;
    }

    public performSync() {
        const toAdd = this.entityArray.getToAdd();
        const toRemove = this.entityArray.getToRemove();
        for (let i = 0; i < toAdd.length; i++) {
            const actions = toAdd[i].getActions();
            actions.onEntityCreated && actions.onEntityCreated();
        }

        for (let i = 0; i < toRemove.length; i++) {
            const actions = toRemove[i].getActions();
            actions.onEntityDeleted && actions.onEntityDeleted();
        }
        this.entityArray.sync();
    }
}
