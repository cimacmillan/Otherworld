import { Entity } from "../../engine/Entity";
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
    console.log("Load map", tiled);
    // layers.forEach((layer) => loadLayer(serviceLocator, layer, entities));
    return { entities };
}
