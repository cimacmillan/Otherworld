import { MapLayerConverter, MapLayerConverterType } from "./MapLayerConverters";

export interface MapSchema {
    layers: MapLayerSchema[];
}

interface MapLayerSchema {
    imageUrl: string;
    mapLayerConverter: MapLayerConverterType;
    mapMetadata: MapLayerMetadata[];
}

export interface MapLayerMetadata {
    x: number;
    y: number;
    data: MapMetadataObject;
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
    mapMetadata: LoadedMapLayerMetadata;
}

export interface LoadedMapLayerMetadata {
    [x: number]: {
        [y: number]: MapMetadataObject;
    };
}

export type MapMetadataObject = any;
