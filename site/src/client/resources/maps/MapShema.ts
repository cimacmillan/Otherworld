import { MapLayerConverter, MapLayerConverterType } from "./MapLayerConverter";

export interface MapSchema {
    layers: MapLayerSchema[];
}

interface MapLayerSchema {
    imageUrl: string;
    mapLayerConverter: MapLayerConverterType;
}

/**
 * Loaded version of the above
 */

export interface GameMap {
    layers: MapLayer[];
}

export interface MapLayer {
    image: ImageData;
    mapLayerConverter: MapLayerConverter;
}
