import { Maps } from "../../resources/manifests/Maps";
import { ServiceLocator } from "../ServiceLocator";
import { loadMap, MapLoaderResult, SpawnPoint } from "./MapLoader";

type MapDestinationID = string;
type PlayerDestination = MapDestinationID;

export interface MapDestination {
    mapId: Maps;
    destination?: PlayerDestination;
}

export interface MapData {
    [key: string]: MapLoaderResult;
}

export class MapService {
    private serviceLocator: ServiceLocator;
    private currentMap: Maps;
    private currentMapData: MapData = {};
    private currentSpawnPoints: SpawnPoint[] = [];

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public setExistingMapData(currentMapData: MapData, currentMap: Maps) {
        this.currentMapData = currentMapData;
        this.currentMap = currentMap;
    }

    public goToLocation(dest: MapDestination) {
        const { mapId, destination } = dest;

        if (mapId !== this.getCurrentMap()) {
            // Save the current map entites to map data
            if (this.currentMap) {
                this.syncMapData();
            }
            this.currentMap = mapId;
            this.currentMapData = this.getMapData();
            this.serviceLocator.getScriptingService().offloadEntities();
            const map = this.serviceLocator.getResourceManager().manifest.maps[
                mapId
            ];

            if (this.currentMapData[dest.mapId]) {
                const { entities, spawnPoints } = this.currentMapData[
                    dest.mapId
                ];
                this.currentSpawnPoints = spawnPoints;
                entities.forEach((ent) =>
                    this.serviceLocator.getWorld().addEntity(ent)
                );
            } else {
                const { entities, spawnPoints } = loadMap(
                    this.serviceLocator,
                    map
                );
                this.currentSpawnPoints = spawnPoints;
                entities.forEach((ent) =>
                    this.serviceLocator.getWorld().addEntity(ent)
                );
            }

            map.metadata.onStart(this.serviceLocator);
        }

        const player = this.serviceLocator.getScriptingService().getPlayer();
        const spawnPoint = this.getSpawnPoint(destination);
        const { position, angle } = spawnPoint;
        const { x, y } = position;

        console.log("spawn point ", spawnPoint);

        player.setPosition(x, y);
        player.setAngle(angle);
    }

    public getCurrentMap(): Maps {
        return this.currentMap;
    }

    public syncMapData() {
        this.currentMapData = {
            ...this.currentMapData,
            [this.currentMap]: {
                entities: [
                    ...this.serviceLocator
                        .getWorld()
                        .getEntityArray()
                        .getArray(),
                ],
                spawnPoints: this.currentSpawnPoints,
            },
        };
    }

    public getMapData(): MapData {
        return this.currentMapData;
    }

    private getSpawnPoint(id?: string): SpawnPoint {
        const search = id || "BIRTH";
        const spawn = this.currentSpawnPoints.find(
            (point) => point.name === search
        );
        if (!spawn) {
            console.error(
                "No spawn point ",
                this.currentSpawnPoints,
                this.currentMap
            );
        }
        return spawn;
    }
}
