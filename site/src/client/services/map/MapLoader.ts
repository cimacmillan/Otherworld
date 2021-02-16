import { Entity } from "../../engine/Entity";
import { EntityFactory } from "../../engine/scripting/factory/EntityFactory";
import { createStaticWallState } from "../../engine/scripting/factory/SceneryFactory";
import { LoadedMap } from "../../resources/maps/MapTypes";
import { Vector2D } from "../../types";
import { ServiceLocator } from "../ServiceLocator";
import { GameTiledObjectType, PointObject, PolyObject } from "./TiledParser";
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
    const properties = object.data.properties;

    switch (object.data.type) {
        case TiledObjectType.SpawnPoint:
            const angle = Number.parseInt(object.data.properties.angle);
            const name = object.data.properties.name;
            spawnPoints.push({
                angle,
                name,
                position: {
                    x: object.data.x,
                    y: object.data.y,
                },
            });
            break;
    }
}
