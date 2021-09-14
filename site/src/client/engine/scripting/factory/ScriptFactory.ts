import { GameItem } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { ItemDropDistribution } from "../items/ItemDrops";
import { createChestState } from "./ChestFactory";
import { EntityFactory } from "./EntityFactory";

interface ScriptState {
    position: Vector2D;
}

const STARTING_ITEMS: ItemDropDistribution = [
    [GameItem.WEAPON_WOOD_STICK, [0, 1], 1]
];

export function createScript(
    serviceLocator: ServiceLocator,
    state: ScriptState
) {
    return new Entity<ScriptState>(
        serviceLocator,
        state,
        {
            getActions: (entity: Entity<ScriptState>) => ({
                onEntityCreated: () => {
                    const { position } = state;
                    serviceLocator.getWorld().addEntity(
                        EntityFactory.CHEST(serviceLocator, createChestState(position, STARTING_ITEMS))
                    );
                }
            })
        }
    )
}

export function createScriptState(
    position: Vector2D
): ScriptState {
    return {
        position
    };
}

