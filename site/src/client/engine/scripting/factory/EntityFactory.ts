import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { createDoor } from "./DoorFactory";
import { createSlime } from "./EnemyFactory";
import { createItemDrop } from "./ItemFactory";
import { createLadder } from "./MapChangeFactory";
import {
    createStaticFloor,
    createStaticSprite,
    createStaticWall,
} from "./SceneryFactory";

export enum EntityType {
    NULL = "NULL",

    DOOR = "DOOR",
    DOOR_LOCKED = "DOOR_LOCKED",

    ENEMY_SLIME = "ENEMY_SLIME",

    ITEM_DROP = "ITEM_DROP",

    LADDER = "LADDER",

    SCENERY_FLOOR = "SCENERY_FLOOR",
    SCENERY_WALL = "SCENERY_WALL",
    SCENERY_SPRITE = "SCENERY_SPRITE",
}

type EntityCreationFunction = (
    serviceLocator: ServiceLocator,
    state: object
) => Entity<object>;

function withType(
    type: EntityType,
    func: EntityCreationFunction
): EntityCreationFunction {
    return (serviceLocator: ServiceLocator, state: object) => {
        const entity = func(serviceLocator, state);
        return entity.withType(type);
    };
}

const entityFactory: Record<EntityType, EntityCreationFunction> = {
    [EntityType.NULL]: () => {
        throw new Error("Entity type is null");
    },
    [EntityType.DOOR]: createDoor,
    [EntityType.DOOR_LOCKED]: createDoor,
    [EntityType.ENEMY_SLIME]: createSlime,
    [EntityType.ITEM_DROP]: createItemDrop,
    [EntityType.LADDER]: createLadder,
    [EntityType.SCENERY_FLOOR]: createStaticFloor,
    [EntityType.SCENERY_WALL]: createStaticWall,
    [EntityType.SCENERY_SPRITE]: createStaticSprite,
};

const factoryWithType: any = {};

for (const key in entityFactory) {
    const type = key as EntityType;
    factoryWithType[type] = withType(type, entityFactory[type]);
}

export const EntityFactory = factoryWithType as Record<
    EntityType,
    EntityCreationFunction
>;
