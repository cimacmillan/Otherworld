import { GameItem } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { randomFloatRange, vec } from "../../../util/math";
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
    levelStage: LevelStage;
    activeEnemies: number;
}

const STARTING_ITEMS: ItemDropDistribution = [
    [GameItem.WEAPON_WOOD_STICK, [0, 1], 1]
];

const OTHER_ITEMS: ItemDropDistribution = [
    [GameItem.GOLD_COIN, [0, 0.1], 5],
    [GameItem.GOLD_COIN, [0.1, 0.5], 2],
    [GameItem.GOLD_COIN, [0.5, 1], 1],
];

function addChest(entity: Entity<ScriptState>) {
    const { stage } = entity.getState();
    const serviceLocator = entity.getServiceLocator();
    const { position } = entity.getState();
    let chest = EntityFactory.CHEST(serviceLocator, createChestState(position, STARTING_ITEMS));
    if (stage !== 1) {
        chest = EntityFactory.CHEST(serviceLocator, createChestState(position, OTHER_ITEMS));
    }
    serviceLocator.getWorld().addEntity(chest);
}

function addEnemy(entity: Entity<ScriptState>) {
    const { stage, position } = entity.getState();
    const serviceLocator = entity.getServiceLocator();
    const severity = stage * stage;
    for (let x = 0; x < severity; x ++) {
        const spawnPoint = vec.vec_add(
            position,
            {
                x: randomFloatRange(-1, 1),
                y: randomFloatRange(-1, 1),
            }
        );
        const enemy = EntityFactory.NPC_BULKY_MAN(serviceLocator, createNPCState({
            position: spawnPoint,
            npcTypeId: "jailor"
        }));
        serviceLocator.getWorld().addEntity(enemy);
    }
    entity.setState({
        activeEnemies: severity
    });
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
                            const { stage } = entity.getState();
                            entity.setState({
                                stage: stage + 1,
                                levelStage: LevelStage.OPEN_CHEST
                            })
                            entity.getServiceLocator().getStore().getActions().onStageReached(stage + 1);
                            addChest(entity);
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
                            const { activeEnemies } = entity.getState();
                            const newEnemies = activeEnemies - 1;
                            entity.setState({
                                activeEnemies: newEnemies
                            })
                            if (newEnemies <= 0) {
                                entity.setState({
                                    levelStage: LevelStage.SPAWN_REWARD
                                });
                            }
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
        levelStage: LevelStage.SPAWN_REWARD,
        activeEnemies: 0
    };
}

