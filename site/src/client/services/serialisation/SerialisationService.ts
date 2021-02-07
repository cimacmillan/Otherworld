import { VERSION } from "../../Config";
import { Entity } from "../../engine/Entity";
import { Player, PlayerSerialisation } from "../../engine/player/Player";
import {
    EntityFactory,
    EntityType,
} from "../../engine/scripting/factory/EntityFactory";
import { TutorialSerialisation } from "../../engine/scripting/TutorialService";
import { store } from "../../ui/State";
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
            };
        };
        currentMap: string;
        player: PlayerSerialisation;
    };
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
        const uiState = store.getValue();
        const mapData = this.serviceLocator.getMapService().getMapData();
        const serialisedMapData = Object.entries(mapData).reduce(
            (prev, currentValue) => {
                const [key, value] = currentValue;
                return {
                    ...prev,
                    [key]: {
                        entities: this.serialiseEntities(value.entities),
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
            uiState,
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
