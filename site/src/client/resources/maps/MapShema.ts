export interface MapSchema {
    layers: MapLayerSchema[];
}

interface MapLayerSchema {
    imageUrl: string;
}

/**
 * Loaded version of the above
 */

export interface GameMap {
    layers: MapLayer[];
}

interface MapLayer {
    image: ImageData;
}