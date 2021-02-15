import { Entity } from "../../engine/Entity";
import { EntityFactory } from "../../engine/scripting/factory/EntityFactory";
import { createStaticWallState } from "../../engine/scripting/factory/SceneryFactory";
import { Sprites } from "../../resources/manifests/Sprites";
import { LoadedMap } from "../../resources/maps/MapTypes";
import { ServiceLocator } from "../ServiceLocator";
import { GameTiledObjectType, PolyObject } from "./TiledParser";

interface MapLoaderResult {
    entities: Array<Entity<any>>;
}

enum OtherworldObjectType {
    Wall = "Wall",
    Door = "Door",
}

export function loadMap(
    serviceLocator: ServiceLocator,
    gameMap: LoadedMap
): MapLoaderResult {
    console.log("Loading map", gameMap);

    const { tiled } = gameMap;
    const entities: Array<Entity<any>> = [];

    tiled.objects.forEach((object) => {
        switch (object.type) {
            case GameTiledObjectType.Polygon:
                loadPolygon({
                    serviceLocator,
                    entities,
                    object,
                });
                break;
        }
    });

    return { entities };
}

export function loadPolygon(args: {
    serviceLocator: ServiceLocator;
    entities: Array<Entity<any>>;
    object: PolyObject;
}) {
    const { serviceLocator, entities, object } = args;
    const { closed, points } = object;

    switch (object.data.type) {
        case OtherworldObjectType.Wall:
            const length = closed ? points.length : points.length - 1;
            for (let x = 0; x < length; x++) {
                const first = points[x];
                const second = points[(x + 1) % points.length];
                entities.push(
                    EntityFactory.SCENERY_WALL(
                        serviceLocator,
                        createStaticWallState(Sprites.WALL, first, second)
                    )
                );
            }
            break;
        case OtherworldObjectType.Door:
            break;
    }
}
