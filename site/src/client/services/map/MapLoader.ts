import { Entity } from "../../engine/Entity";
import { EntityFactory } from "../../engine/scripting/factory/EntityFactory";
import { createStaticWallState } from "../../engine/scripting/factory/SceneryFactory";
import { Sprites } from "../../resources/manifests/Sprites";
import { LoadedMap } from "../../resources/maps/MapTypes";
import { ServiceLocator } from "../ServiceLocator";

interface MapLoaderResult {
    entities: Array<Entity<any>>;
}

export function loadMap(
    serviceLocator: ServiceLocator,
    gameMap: LoadedMap
): MapLoaderResult {
    const { tiled } = gameMap;
    const entities: Array<Entity<any>> = [];

    tiled.objects.forEach((obj) => {
        if (obj.type === "Polygon") {
            const length = obj.closed
                ? obj.points.length
                : obj.points.length - 1;
            for (let x = 0; x < length; x++) {
                const first = obj.points[x];
                const second = obj.points[(x + 1) % obj.points.length];
                entities.push(
                    EntityFactory.SCENERY_WALL(
                        serviceLocator,
                        createStaticWallState(Sprites.WALL, first, second)
                    )
                );
            }
        }
    });

    // layers.forEach((layer) => loadLayer(serviceLocator, layer, entities));
    return { entities };
}
