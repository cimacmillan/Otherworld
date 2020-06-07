import { EggLogicComponent } from "../../engine/components/enemies/egg/EggLogicComponent";
import { MacatorLogicComponent } from "../../engine/components/enemies/macator/MacatorLogicComponent";
import { MacatorRenderComponent } from "../../engine/components/enemies/macator/MacatorRenderComponent";
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
        const serialisation = {
            version: 1,
            world: {
                entities,
            },
        };
        return serialisation;
    }

    public deserialise(data: SerialisationObject) {
        const deserialisedEntities = data.world.entities.map((ent) =>
            this.deserialiseEntity(ent)
        );
        this.serviceLocator
            .getScriptingService()
            .bootsrapDeserialisedContent(deserialisedEntities);
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
    ): EntityComponent<any> {
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
