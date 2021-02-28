import { GameTiledMap } from "../../services/map/TiledParser";
import { ServiceLocator } from "../../services/ServiceLocator";

interface MapMetadata {
    onStart: (serviceLocator: ServiceLocator) => void;
}

export interface UnloadedMap {
    url: string;
    metadata: MapMetadata;
}

export interface LoadedMap {
    tiled: GameTiledMap;
    metadata: MapMetadata;
}
