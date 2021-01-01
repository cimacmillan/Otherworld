import { Entity } from "../../engine/Entity";
import { ServiceLocator } from "../../services/ServiceLocator";
import { getHexFromRGB } from "../../util/math/UI";
import { MapLayerConverter } from "./MapLayerConverters";
import { GameMap, MapLayer, MapMetadataObject } from "./MapShema";

export function loadMap(serviceLocator: ServiceLocator, gameMap: GameMap) {
    const { layers } = gameMap;

    layers.forEach((layer) => loadLayer(serviceLocator, layer));
}

function loadLayer(serviceLocator: ServiceLocator, layer: MapLayer) {
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
                metadata
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
    metadata: MapMetadataObject
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

    const addEntity = (entity: Entity<any>) => {
        serviceLocator.getWorld().addEntity(entity);
    };

    if (Array.isArray(entities)) {
        entities.forEach((entity) =>
            serviceLocator.getWorld().addEntity(entity)
        );
    } else {
        addEntity(entities);
    }
}
