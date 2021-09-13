import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { createChestState } from "./ChestFactory";
import { EntityFactory } from "./EntityFactory";

interface ScriptState {
    position: Vector2D;
}

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
                        EntityFactory.CHEST(serviceLocator, createChestState(position))
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

