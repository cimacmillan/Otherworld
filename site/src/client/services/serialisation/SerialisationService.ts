import { VERSION } from "../../Config";
import { Entity } from "../../engine/Entity";
import { EntityComponent } from "../../engine/EntityComponent";
import { Player, PlayerSerialisation } from "../../engine/player/Player";
import { EntitySerial } from "../../engine/scripting/factory/Serial";
import { State, store } from "../../ui/State";
import { ServiceLocator } from "../ServiceLocator";
import { Serialisable } from "./Serialisable";

interface SerialisedEntity {
    state: object;
    serial: EntitySerial;
}

export interface SerialisationObject {
    version: string;
    world: {
        entities: SerialisedEntity[];
        player: PlayerSerialisation;
    };
    uiState: State;
}

type EntitySerialisationMap = {
    [component in EntitySerial]: () => Array<EntityComponent<any>>;
};

const entitySerialisationMap: EntitySerialisationMap = {
    [EntitySerial.NULL]: () => [],
};

export class SerialisationService implements Serialisable<SerialisationObject> {
    private serviceLocator: ServiceLocator;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public serialise(): SerialisationObject {
        const uiState = store.getValue();
        const entities = this.serialiseEntities();

        const serialisation = {
            version: VERSION,
            world: {
                player: entities[0],
                entities: entities.slice(1, entities.length),
            },
            uiState,
        };
        return serialisation;
    }

    public deserialise(data: SerialisationObject) {
        const deserialisedEntities = data.world.entities.map((ent) =>
            this.deserialiseEntity(ent)
        );
        const player = this.deserialisePlayer(data.world.player);
        this.serviceLocator
            .getScriptingService()
            .bootsrapDeserialisedContent(player, deserialisedEntities);
        store.next(data.uiState);
    }

    public deserialisePlayer(player: PlayerSerialisation): Player {
        return new Player(this.serviceLocator);
    }

    public deserialiseEntity(entity: SerialisedEntity): Entity<any> {
        return new Entity(
            entity.serial,
            this.serviceLocator,
            entity.state as any,
            ...entitySerialisationMap[entity.serial]()
        );
    }

    private serialiseEntities(): SerialisedEntity[] {
        const entities = this.serviceLocator
            .getWorld()
            .getEntityArray()
            .getArray();
        const serialised = entities.map(this.serialiseEntity);
        return serialised;
    }

    private serialiseEntity(entity: Entity<any>): SerialisedEntity {
        return {
            state: { ...entity.getState(), exists: false },
            serial: entity.serial,
        };
    }
}
