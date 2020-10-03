import { VERSION } from "../../Config";
import { EggLogicComponent } from "../../engine/components/creatures/egg/EggLogicComponent";
import { MacatorLogicComponent } from "../../engine/components/creatures/macator/MacatorLogicComponent";
import { MacatorRenderComponent } from "../../engine/components/creatures/macator/MacatorRenderComponent";
import { InteractionComponent } from "../../engine/components/InteractionComponent";
import { ItemDropComponent } from "../../engine/components/items/ItemDropComponent";
import { BoundaryComponent } from "../../engine/components/physics/BoundaryComponent";
import { PhysicsComponent } from "../../engine/components/physics/PhysicsComponent";
import { PlayerControlComponent } from "../../engine/components/player/PlayerControlComponent";
import { PlayerInventoryComponent } from "../../engine/components/player/PlayerInventoryComponent";
import { FloorRenderComponent } from "../../engine/components/rendering/FloorRenderComponent";
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
        player: SerialisationEntity;
    };
    uiState: State;
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

    public deserialiseEntity(entity: SerialisationEntity): Entity<any> {
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
    ): EntityComponent<any> | undefined {
        switch (componentType) {
            case EntityComponentType.PhysicsComponent:
                return new PhysicsComponent();
            case EntityComponentType.InteractionComponent:
                return new InteractionComponent();
            case EntityComponentType.BoundaryComponent:
                return new BoundaryComponent();

            case EntityComponentType.FloorRenderComponent:
                return new FloorRenderComponent();
            case EntityComponentType.SpriteRenderComponent:
                return new SpriteRenderComponent();
            case EntityComponentType.WallRenderComponent:
                return new WallRenderComponent();

            case EntityComponentType.PlayerInventoryComponent:
                return new PlayerInventoryComponent();
            case EntityComponentType.PlayerControlComponent:
                return new PlayerControlComponent();
            case EntityComponentType.ItemDropComponent:
                return new ItemDropComponent();

            case EntityComponentType.EggLogicComponent:
                return new EggLogicComponent();
            case EntityComponentType.MacatorLogicComponent:
                return new MacatorLogicComponent();
            case EntityComponentType.MacatorRenderComponent:
                return new MacatorRenderComponent();
        }

        throw new Error(
            `Deserialisation error, component type not recognised ${componentType}`
        );
    }

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
            state: { ...entity.getState(), exists: false },
            components: entity.getComponents().map((component) => {
                return { componentType: component.componentType };
            }),
        };
    }
}
