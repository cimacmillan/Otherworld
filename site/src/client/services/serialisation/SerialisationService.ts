import { Entity } from "../../engine/Entity";
import { EntityComponentType } from "../../engine/EntityComponent";
import { ServiceLocator } from "../ServiceLocator";
import { Serialisable } from "./Serialisable";

interface SerialisationObject {
    version: number;
    world: {
        entities: Array<{
            state: object;
            components: Array<{
                componentType: EntityComponentType;
            }>;
        }>;
    };
}

interface SerialisationEntity {
    state: object;
    components: Array<{
        componentType: EntityComponentType;
    }>;
}

export class SerialisationService implements Serialisable<SerialisationObject> {
    private serviceLocator: ServiceLocator;

    public constructor() {}

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    public serialise(): SerialisationObject {
        const entities = this.serialiseEntities();
        return {
            version: 1,
            world: {
                entities,
            },
        };
    }

    public deserialise(data: SerialisationObject) {}

    private serialiseEntities(): SerialisationEntity[] {
        const entities = this.serviceLocator
            .getWorld()
            .getEntityArray()
            .getArray();
        const serialised = entities.map(this.serialiseEntity);
        return serialised;
    }

    private serialiseEntity(entity: Entity<any>): SerialisationEntity {
        return {
            state: entity.getState(),
            components: entity.getComponents().map((component) => {
                return { componentType: component.componentType };
            }),
        };
    }
}
