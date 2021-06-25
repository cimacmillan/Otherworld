import { Entity } from "../../engine/Entity";
import {
    createDoorState,
    createLockedDoorState,
} from "../../engine/scripting/factory/DoorFactory";
import { EntityFactory } from "../../engine/scripting/factory/EntityFactory";
import { createItemDropState } from "../../engine/scripting/factory/ItemFactory";
import { createLadderState } from "../../engine/scripting/factory/MapChangeFactory";
import { createNPCState } from "../../engine/scripting/factory/NPCFactory";
import {
    createStaticFloorState,
    createStaticSpriteState,
    createStaticWallState,
} from "../../engine/scripting/factory/SceneryFactory";
import { GameItem, GameItems } from "../../resources/manifests/Items";
import { Maps } from "../../resources/manifests/Maps";
import { LoadedMap } from "../../resources/maps/MapTypes";
import { Vector2D } from "../../types";
import { ServiceLocator } from "../ServiceLocator";
import {
    GameTiledObjectType,
    PointObject,
    PolyObject,
    RectangleObject,
} from "./TiledParser";
import { TiledObjectType } from "./TiledProperties";

export interface SpawnPoint {
    name: string;
    position: Vector2D;
    angle: number;
}

export interface MapLoaderResult {
    entities: Array<Entity<any>>;
    spawnPoints: SpawnPoint[];
}

export function loadMap(
    serviceLocator: ServiceLocator,
    gameMap: LoadedMap
): MapLoaderResult {
    console.log("Loading map", gameMap);

    const { tiled } = gameMap;
    const entities: Array<Entity<any>> = [];
    const spawnPoints: SpawnPoint[] = [];

    tiled.objects.forEach((object) => {
        switch (object.type) {
            case GameTiledObjectType.Polygon:
                loadPolygon({
                    serviceLocator,
                    entities,
                    object,
                });
                break;
            case GameTiledObjectType.Point:
                loadPoint({
                    serviceLocator,
                    entities,
                    spawnPoints,
                    object,
                });
                break;
            case GameTiledObjectType.Rectangle:
                loadRectangle({
                    serviceLocator,
                    entities,
                    object,
                });
                break;
        }
    });

    return { entities, spawnPoints };
}

export function loadPolygon(args: {
    serviceLocator: ServiceLocator;
    entities: Array<Entity<any>>;
    object: PolyObject;
}) {
    const { serviceLocator, entities, object } = args;
    const { closed, points } = object;
    const properties = object.data.properties;

    console.log("loadPolygon", object);

    switch (object.data.type) {
        case TiledObjectType.Wall:
            const length = closed ? points.length : points.length - 1;
            for (let x = 0; x < length; x++) {
                const first = points[x];
                const second = points[(x + 1) % points.length];
                entities.push(
                    EntityFactory.SCENERY_WALL(
                        serviceLocator,
                        createStaticWallState(properties.sprite, first, second)
                    )
                );
            }
            break;
        case TiledObjectType.Door:
            const start = points[0];
            const end = points[1];

            if (properties.keyId || properties.locked) {
                entities.push(
                    EntityFactory.DOOR_LOCKED(
                        serviceLocator,
                        createLockedDoorState({
                            start,
                            end,
                            spriteString: properties.sprite,
                            keyId: properties.keyId as GameItem,
                            configuration: properties.locked
                                ? {
                                      width: Number.parseFloat(
                                          properties.width
                                      ),
                                      height: Number.parseFloat(
                                          properties.height
                                      ),
                                      shouldReset: properties.resets === "true",
                                  }
                                : undefined,
                        })
                    )
                );
            } else {
                entities.push(
                    EntityFactory.DOOR(
                        serviceLocator,
                        createDoorState(start, end, properties.sprite)
                    )
                );
            }
            break;
    }
}

export function loadPoint(args: {
    serviceLocator: ServiceLocator;
    entities: Array<Entity<any>>;
    spawnPoints: SpawnPoint[];
    object: PointObject;
}) {
    const { serviceLocator, entities, object, spawnPoints } = args;
    const { properties } = object.data;

    switch (object.data.type) {
        case TiledObjectType.SpawnPoint:
            const angle = Number.parseFloat(properties.angle);
            const name = properties.name;
            spawnPoints.push({
                angle,
                name,
                position: {
                    x: object.data.x,
                    y: object.data.y,
                },
            });
            break;
        case TiledObjectType.GameItem:
            entities.push(
                EntityFactory.ITEM_DROP(
                    serviceLocator,
                    createItemDropState({
                        item: GameItems[properties.item as GameItem],
                        position: {
                            x: object.data.x,
                            y: object.data.y,
                        },
                    })
                )
            );
            break;
        case TiledObjectType.Portal:
            entities.push(
                EntityFactory.LADDER(
                    serviceLocator,
                    createLadderState(
                        object.data.x,
                        object.data.y,
                        "ladder",
                        {
                            mapId: properties.map as Maps,
                            destination: properties.spawn,
                        }
                    )
                )
            );
            break;
        case TiledObjectType.NPC:
            entities.push(
                EntityFactory.NPC_BULKY_MAN(
                    serviceLocator,
                    createNPCState({
                        position: {
                            x: object.data.x,
                            y: object.data.y
                        },
                        npcTypeId: properties.npcTypeId
                    })
                )
            )
            break;
    }
}

export function loadRectangle(args: {
    serviceLocator: ServiceLocator;
    entities: Array<Entity<any>>;
    object: RectangleObject;
}) {
    const { serviceLocator, entities, object } = args;
    const { properties } = object.data;

    switch (object.data.type) {
        case TiledObjectType.Floor:
            const { sprite, height } = properties;
            entities.push(
                EntityFactory.SCENERY_FLOOR(
                    serviceLocator,
                    createStaticFloorState(
                        sprite,
                        Number.parseFloat(height),
                        {
                            x: object.data.x,
                            y: object.data.y,
                        },
                        {
                            x: object.data.x + object.width,
                            y: object.data.y + object.height,
                        }
                    )
                )
            );
            break;
        case TiledObjectType.StaticSprite:
            entities.push(
                EntityFactory.SCENERY_SPRITE(
                    serviceLocator,
                    createStaticSpriteState(
                        properties.sprite,
                        {
                            x: object.data.x + object.width / 2,
                            y: object.data.y + object.height / 2,
                        },
                        Number.parseFloat(properties.height),
                        object.width,
                        object.height
                    )
                )
            );
            break;
    }
}
