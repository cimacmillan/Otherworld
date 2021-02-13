import { ServiceLocator } from "../../services/ServiceLocator";

export type TiledMap = Record<string, any>;

interface MapMetadata {
    onStart: (serviceLocator: ServiceLocator) => void;
}

export interface UnloadedMap {
    url: string;
    metadata: MapMetadata;
}

export interface LoadedMap {
    tiled: TiledMap;
    metadata: MapMetadata;
}
