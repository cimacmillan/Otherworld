import { VERSION } from "../../Config";
import { Entity } from "../../engine/Entity";
import { EntityComponent } from "../../engine/EntityComponent";
import { State, store } from "../../ui/State";
import { EntitySerial } from "../scripting/factory/Serial";
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
        player: SerialisedEntity;
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
        const player = this.deserialiseEntity(data.world.player);
        this.serviceLocator
            .getScriptingService()
            .bootsrapDeserialisedContent(player, deserialisedEntities);
        store.next(data.uiState);
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
