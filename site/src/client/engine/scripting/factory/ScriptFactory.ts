import { GameItem } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { JoinComponent } from "../../components/util/JoinComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { ItemDropDistribution } from "../items/ItemDrops";
import { createChestState } from "./ChestFactory";
import { EntityFactory } from "./EntityFactory";
import { createNPCState } from "./NPCFactory";

interface ScriptState {
    position: Vector2D;
    stage: number;
    levelStage: LevelStage
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

enum LevelStage {
    SPAWN_REWARD = "SPAWN_REWARD",
    OPEN_CHEST = "OPEN_CHEST",
    KILL_ENEMIES = "KILL_ENEMIES"
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
                    const { stage } = entity.getState();
                    entity.getServiceLocator().getStore().getActions().onStageReached(stage);
                }
            })
        },
        new SwitchComponent(
            {
                [LevelStage.SPAWN_REWARD]: JoinComponent([{
                    getActions: (entity: Entity<ScriptState>) => ({
                        onEntityCreated: () => {
                            addChest(entity);
                            const { stage } = entity.getState();
                            entity.setState({
                                stage: stage + 1,
                                levelStage: LevelStage.OPEN_CHEST
                            })
                            entity.getServiceLocator().getStore().getActions().onStageReached(stage + 1);
                        }
                    })
                }]),
                [LevelStage.OPEN_CHEST]: JoinComponent([{
                    getActions: (entity: Entity<ScriptState>) => ({
                        onChestOpened: () => {
                            addEnemy(entity);
                            entity.setState({
                                levelStage: LevelStage.KILL_ENEMIES
                            });
                        }
                    })
                }]),
                [LevelStage.KILL_ENEMIES]: JoinComponent([{
                    getActions: (entity: Entity<ScriptState>) => ({
                        onEnemyKilled: () => {
                            entity.setState({
                                levelStage: LevelStage.SPAWN_REWARD
                            });
                        }
                    })
                }])
            },
            state.levelStage,
            ent => ent.getState().levelStage
        )
    )
}

export function createScriptState(
    position: Vector2D
): ScriptState {
    return {
        position,
        stage: 0,
        levelStage: LevelStage.SPAWN_REWARD
    };
}

