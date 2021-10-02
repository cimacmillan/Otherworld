import { GameItem } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { Entity } from "../../Entity";
import { ItemDropDistribution } from "../items/ItemDrops";
import { createChestState } from "./ChestFactory";
import { EntityFactory } from "./EntityFactory";
import { createNPCState } from "./NPCFactory";

interface ScriptState {
    position: Vector2D;
}

const STARTING_ITEMS: ItemDropDistribution = [
    [GameItem.WEAPON_WOOD_STICK, [0, 1], 1]
];

function addChest(entity: Entity<ScriptState>) {
    const serviceLocator = entity.getServiceLocator();
    const { position } = entity.getState();
    const chest = EntityFactory.CHEST(serviceLocator, createChestState(position, STARTING_ITEMS));
    serviceLocator.getWorld().addEntity(chest);
}

function addEnemy(entity: Entity<ScriptState>) {
    const serviceLocator = entity.getServiceLocator();
    const { position } = entity.getState();
    const enemy = EntityFactory.NPC_BULKY_MAN(serviceLocator, createNPCState({
        position,
        npcTypeId: "jailor"
    }));
    serviceLocator.getWorld().addEntity(enemy);
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
                    addChest(entity);
                },
                onChestOpened: () => {
                    addEnemy(entity);
                },
                onEnemyKilled: () => {
                    addChest(entity);
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

