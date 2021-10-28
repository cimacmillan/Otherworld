import { VERSION } from "../../Config";
import { Entity } from "../../engine/Entity";
import { Player, PlayerSerialisation } from "../../engine/player/Player";
import {
    EntityFactory,
    EntityType,
} from "../../engine/scripting/factory/EntityFactory";
import { TutorialSerialisation } from "../../engine/scripting/TutorialService";
import { State, store } from "../../ui/State";
import { SpawnPoint } from "../map/MapLoader";
import { MapData } from "../map/MapService";
import { ServiceLocator } from "../ServiceLocator";
import { Serialisable } from "./Serialisable";

interface SerialisedEntity {
    state: object;
    serial: EntityType;
}

export interface SerialisationObject {
    version: string;
    world: {
        maps: {
            [key: string]: {
                entities: SerialisedEntity[];
                spawnPoints: SpawnPoint[];
            };
        };
        currentMap: string;
        player: PlayerSerialisation;
    };
    maxStage: number,
    services: {
        tutorial: TutorialSerialisation;
    };
}

export interface DeserialisedObject {
    world: {
        maps: MapData;
        currentMap: string;
        player: Player;
    };
    maxStage: number,
    services: {
        tutorial: TutorialSerialisation;
    };
}

export class SerialisationService implements Serialisable<SerialisationObject> {
    private serviceLocator: ServiceLocator;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public serialise(): SerialisationObject {
        this.serviceLocator.getMapService().syncMapData();
        const mapData = this.serviceLocator.getMapService().getMapData();
        const serialisedMapData = Object.entries(mapData).reduce(
            (prev, currentValue) => {
                const [key, value] = currentValue;
                return {
                    ...prev,
                    [key]: {
                        entities: this.serialiseEntities(value.entities),
                        spawnPoints: value.spawnPoints,
                    },
                };
            },
            {} as any
        );

        const serialisation = {
            version: VERSION,
            world: {
                player: this.serviceLocator
                    .getScriptingService()
                    .getPlayer()
                    .serialise(),
                maps: serialisedMapData,
                currentMap: this.serviceLocator.getMapService().getCurrentMap(),
            },
            maxStage: store.getState().gameStart.maxStage,
            services: {
                tutorial: this.serviceLocator.getTutorialService().serialise(),
            },
        };
        return serialisation;
    }

    public deserialise(data: SerialisationObject): DeserialisedObject {
        const maps = Object.entries(data.world.maps).reduce((prev, current) => {
            const [key, value] = current;
            return {
                ...prev,
                [key]: {
                    entities: value.entities.map((ent) =>
                        this.deserialiseEntity(ent)
                    ),
                    spawnPoints: value.spawnPoints,
                },
            };
        }, {} as any);
        const player = this.deserialisePlayer(data.world.player);
        const deserialisedObject: DeserialisedObject = {
            world: {
                maps,
                currentMap: data.world.currentMap,
                player,
            },
            services: {
                tutorial: data.services.tutorial,
            },
            maxStage: data.maxStage
        };

        return deserialisedObject;
    }

    public deserialisePlayer(player: PlayerSerialisation): Player {
        return new Player(this.serviceLocator, player);
    }

    public deserialiseEntity(entity: SerialisedEntity): Entity<any> {
        return EntityFactory[entity.serial](this.serviceLocator, entity.state);
    }

    public serialiseEntities(entities: Array<Entity<any>>): SerialisedEntity[] {
        const serialised = entities.map((ent) => this.serialiseEntity(ent));
        return serialised;
    }

    public serialiseEntity(entity: Entity<any>): SerialisedEntity {
        return {
            state: { ...entity.getState(), exists: false },
            serial: entity.type,
        };
    }
}
