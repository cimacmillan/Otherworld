import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { createDoor, createLockedDoor } from "./DoorFactory";
import { createItemDrop } from "./ItemFactory";
import { createLadder } from "./MapChangeFactory";
import { createNPC } from "./NPCFactory";
import {
    createStaticFloor,
    createStaticSprite,
    createStaticWall,
} from "./SceneryFactory";

export enum EntityType {
    NULL = "NULL",

    DOOR = "DOOR",
    DOOR_LOCKED = "DOOR_LOCKED",

    NPC_BULKY_MAN = "NPC_BULKY_MAN",

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
    if (!func) {
        console.error(`Missing entity type "${type}"`);
    }
    return (serviceLocator: ServiceLocator, state: object) => {
        const entity = func(serviceLocator, state);
        return entity.withType(type);
    };
}

const entityFactory: Record<EntityType, EntityCreationFunction> = {
    [EntityType.NULL]: () => {
        throw new Error("Entity type is null");
    },
    [EntityType.DOOR]: (...args: any[]) => createDoor(args[0], args[1]),
    [EntityType.DOOR_LOCKED]: (...args: any[]) => createLockedDoor(args[0], args[1]),
    [EntityType.ITEM_DROP]: createItemDrop,
    [EntityType.LADDER]: createLadder,
    [EntityType.SCENERY_FLOOR]: createStaticFloor,
    [EntityType.SCENERY_WALL]: createStaticWall,
    [EntityType.SCENERY_SPRITE]: createStaticSprite,
    [EntityType.NPC_BULKY_MAN]: createNPC
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
