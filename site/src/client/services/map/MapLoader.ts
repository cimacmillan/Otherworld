import { Entity } from "../../engine/Entity";
import { MapLayerConverter } from "../../resources/maps/MapLayerConverters";
import {
    GameMap,
    MapLayer,
    MapMetadataObject,
} from "../../resources/maps/MapShema";
import { getHexFromRGB } from "../../util/math/UI";
import { ServiceLocator } from "../ServiceLocator";

export function loadMap(
    serviceLocator: ServiceLocator,
    gameMap: GameMap
): Array<Entity<any>> {
    const { layers } = gameMap;
    const entities: Array<Entity<any>> = [];
    layers.forEach((layer) => loadLayer(serviceLocator, layer, entities));
    return entities;
}

function loadLayer(
    serviceLocator: ServiceLocator,
    layer: MapLayer,
    entities: Array<Entity<any>>
) {
    const { image, mapLayerConverter, mapMetadata } = layer;
    const { data, width, height } = image;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (x + y * width) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            const metadata = (mapMetadata[x] && mapMetadata[x][y]) || {};

            loadPixel(
                serviceLocator,
                mapLayerConverter,
                x,
                y,
                r,
                g,
                b,
                a,
                metadata,
                entities
            );
        }
    }
}

function loadPixel(
    serviceLocator: ServiceLocator,
    mapLayerConverter: MapLayerConverter,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    a: number,
    metadata: MapMetadataObject,
    toAdd: Array<Entity<any>>
) {
    const entities = mapLayerConverter({
        serviceLocator,
        x,
        y,
        r,
        g,
        b,
        a,
        hex: getHexFromRGB(r, g, b),
        metadata,
    });

    if (Array.isArray(entities)) {
        entities.forEach((entity) => toAdd.push(entity));
    } else {
        toAdd.push(entities);
    }
}
