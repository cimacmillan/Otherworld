import { VERSION } from "../../Config";
import { BoundaryComponent } from "../../engine/components/core/BoundaryComponent";
import { FloorRenderComponent } from "../../engine/components/core/FloorRenderComponent";
import { InteractionComponent } from "../../engine/components/core/InteractionComponent";
import { PhysicsComponent } from "../../engine/components/core/PhysicsComponent";
import { ItemDropComponent } from "../../engine/components/items/ItemDropComponent";
import { PlayerControlComponent } from "../../engine/components/player/PlayerControlComponent";
import { PlayerInventoryComponent } from "../../engine/components/player/PlayerInventoryComponent";
import { SpriteRenderComponent } from "../../engine/components/rendering/SpriteRenderComponent";
import { WallRenderComponent } from "../../engine/components/rendering/WallRenderComponent";
import { Entity } from "../../engine/Entity";
import {
    EntityComponent,
    EntityComponentType,
} from "../../engine/EntityComponent";
import { State, store } from "../../ui/State";
import { ServiceLocator } from "../ServiceLocator";
import { Serialisable } from "./Serialisable";

interface SerialisedEntity {
    state: object;
    components: Array<{
        componentType: EntityComponentType;
    }>;
}

export interface SerialisationObject {
    version: string;
    world: {
        entities: SerialisedEntity[];
        player: SerialisedEntity;
    };
    uiState: State;
}

type ComponentSerialisationMap = {
    [component in EntityComponentType]: () => EntityComponent<any>;
};

const componentSerialisationMap: ComponentSerialisationMap = {
    [EntityComponentType.PhysicsComponent]: () => new PhysicsComponent(),
    [EntityComponentType.InteractionComponent]: () =>
        new InteractionComponent(),
    [EntityComponentType.BoundaryComponent]: () => new BoundaryComponent(),

    [EntityComponentType.FloorRenderComponent]: () =>
        new FloorRenderComponent(),
    [EntityComponentType.SpriteRenderComponent]: () =>
        new SpriteRenderComponent(),
    [EntityComponentType.WallRenderComponent]: () => new WallRenderComponent(),

    [EntityComponentType.PlayerInventoryComponent]: () =>
        new PlayerInventoryComponent(),
    [EntityComponentType.PlayerControlComponent]: () =>
        new PlayerControlComponent(),
    [EntityComponentType.ItemDropComponent]: () => new ItemDropComponent(),
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
        const components = entity.components.map((component) =>
            this.deserialiseComponent(component.componentType)
        );

        return new Entity(
            this.serviceLocator,
            entity.state as any,
            ...components
        );
    }

    public deserialiseComponent(
        componentType: EntityComponentType
    ): EntityComponent<any> {
        return componentSerialisationMap[componentType]();
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
            components: entity.getComponents().map((component) => {
                return { componentType: component.componentType };
            }),
        };
    }
}
