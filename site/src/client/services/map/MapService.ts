import { Entity } from "../../engine/Entity";
import { Maps } from "../../resources/manifests/Maps";
import { ServiceLocator } from "../ServiceLocator";
import { loadMap } from "./MapLoader";

type MapDestinationID = string;
type PlayerDestination = { x: number; y: number } | MapDestinationID;

export interface MapDestination {
    mapId: Maps;
    destination?: string | { x: number; y: number; angle: number };
}

export interface MapData {
    [key: string]: {
        entities: Array<Entity<any>>;
    };
}

export class MapService {
    private serviceLocator: ServiceLocator;
    private currentMap: Maps;
    private currentMapData: MapData = {};

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public setExistingMapData(currentMapData: MapData, currentMap: Maps) {
        this.currentMapData = currentMapData;
        this.currentMap = currentMap;
    }

    public goToMap(dest: MapDestination) {
        const { mapId, destination } = dest;
        const map = this.serviceLocator.getResourceManager().manifest.maps[
            mapId
        ];

        console.log("Go to map", dest);

        this.serviceLocator.getScriptingService().offloadEntities();

        loadMap(this.serviceLocator, map);

        const player = this.serviceLocator.getScriptingService().getPlayer();

        if (typeof destination === "object") {
            const { x, y, angle } = destination;
            player.setPosition(x, y);
            player.setAngle(angle);
        }

        this.currentMap = mapId;
    }

    public getCurrentMap(): Maps {
        return this.currentMap;
    }

    public getMapData(): MapData {
        return {
            ...this.currentMapData,
            [this.getCurrentMap()]: {
                entities: this.serviceLocator
                    .getWorld()
                    .getEntityArray()
                    .getArray(),
            },
        };
    }
}
