import { Audios } from "../../../resources/manifests/Audios";
import { createAncientSword, createBasicFood, createBasicSword, GameItem, GameItems } from "../../../resources/manifests/Items";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { randomFloatRange, randomIntRange, vec } from "../../../util/math";
import { JoinComponent } from "../../components/util/JoinComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { ItemDropDistribution } from "../items/ItemDrops";
import { createChestState } from "./ChestFactory";
import { EntityFactory } from "./EntityFactory";
import { createNPCState } from "./NPCFactory";
import { NPCTypes } from "./NPCTypes";

interface ScriptState {
    position: Vector2D;
    stage: number;
    levelStage: LevelStage;
    activeEnemies: number;
}

const STARTING_ITEMS: ItemDropDistribution = [
    [GameItems[GameItem.WEAPON_WOOD_STICK], [0, 1], 1],
    // [GameItems[GameItem.GOLD_RING], 1, 1],
    // [GameItems[GameItem.EQUIPMENT_CHEST], 1, 1],
    // [GameItems[GameItem.EQUIPMENT_GREAVES], 1, 1],
    // [GameItems[GameItem.EQUIPMENT_HELMET], 1, 1],
    // [GameItems[GameItem.EQUIPMENT_SHIELD], 1, 1],
    // [createAncientSword(), 1, 1]
];

const CANDY = createBasicFood("food_candy", "Candy", "Hard and sweet", 2);

const OTHER_ITEMS: ItemDropDistribution = [
    [CANDY, [0, 0.1], 5],
    [CANDY, [0.1, 0.5], 2],
    [CANDY, 1, 1],

    [createBasicFood("food_carrot", "Carrot", "Crunchy and helps you see in the dark", 5), 0.8, 1],
    [createBasicFood("food_apple", "Apple", "It feels waxy", 10), 0.5, 1],
    [createBasicFood("food_meat", "Meat", "But what kind?", 40), 0.2, 1],
];

function addChest(entity: Entity<ScriptState>) {
    const { stage } = entity.getState();
    const serviceLocator = entity.getServiceLocator();
    const { position } = entity.getState();
    let items: ItemDropDistribution;
    switch(stage) {
        case 0:
            items = STARTING_ITEMS;
            break;
        case 2: 
            items = [
                ...OTHER_ITEMS, [createBasicSword("weapon_wood_axe", "Wooden axe", "A large wood axe. What can it cut?", 3), 1, 1]
            ];
            break;
        case 4: 
            items = [
                ...OTHER_ITEMS, 
                [createBasicSword("weapon_dagger", "Iron dagger", "A small iron dagger.", 4), 1, 1],
                [GameItems[GameItem.GOLD_RING], 1, 1]
            ];
            break;
        case 6: 
            items = [
                ...OTHER_ITEMS, [createBasicSword("weapon_claymore", "Iron claymore", "An iron claymore. Hard to hold with one hand.", 10), 1, 1]
            ];
            break;
        case 8: 
            items = [
                ...OTHER_ITEMS, 
                [createBasicSword("weapon_heavy_axe", "Heavy axe", "Double sided for extra killing", 14), 1, 1],
                [GameItems[GameItem.EQUIPMENT_GREAVES], 1, 1]
            ];
            break;
        case 10: 
            items = [
                ...OTHER_ITEMS, [createBasicSword("weapon_ceremonial_trident", "Ceremonial trident", "A three-pronged spear. Useful for stabbing multiple enemies.", 18), 1, 1]
            ];
            break;
        case 12: 
            items = [
                ...OTHER_ITEMS, [GameItems[GameItem.EQUIPMENT_HELMET], 1, 1]
            ];
            break;
        case 14: 
            items = [
                ...OTHER_ITEMS, [createBasicSword("weapon_magic_sword", "Magic sword", "A sword weilding curious magical power", 21), 1, 1]
            ];
            break;
        case 16: 
            items = [
                ...OTHER_ITEMS, [GameItems[GameItem.EQUIPMENT_SHIELD], 1, 1]
            ];
            break;
        case 18: 
            items = [
                ...OTHER_ITEMS, [GameItems[GameItem.EQUIPMENT_CHEST], 1, 1]
            ];
            break;
        case 19: 
            items = [
                ...OTHER_ITEMS, [createAncientSword(), 1, 1]
            ];
            break;
        default: 
            items = OTHER_ITEMS;
            break;
    }

    let chest = EntityFactory.CHEST(serviceLocator, createChestState(position, items));
    serviceLocator.getWorld().addEntity(chest);
}

function fib(x: number): number {
    if (x <= 1) {
        return 1;
    }
    return fib(x - 1) + fib(x - 2);
}

function getSpawnPoint(entity: Entity<ScriptState>): Vector2D {
    const { stage, position} = entity.getState();
    const serviceLocator = entity.getServiceLocator();
    const allSpawnPoints = serviceLocator.getMapService().getSpawnPoints();

    const enemySpawnPoints = allSpawnPoints.filter(spawn => spawn.name.includes("SPAWN"));
    if (stage === 20) {
        return position;
    }
    return enemySpawnPoints[randomIntRange(0, enemySpawnPoints.length)].position;
}

function getNpcType(stage: number): string {
    let npcTypeId = "slime";
    const grad = stage / 20;
    if (grad < 2 + Math.random() * 1.5) {
        npcTypeId = "jailor";
    }
    if (grad < 0.8 + Math.random() * 0.4) {
        npcTypeId = "small_jailor";
    }
    if (grad < 0.6 + Math.random() * 0.3) {
        npcTypeId = "slime";
    }
    if (grad < 0.4 + Math.random() * 0.2) {
        npcTypeId = "small_slime";
    }
    if (randomFloatRange(0, 1) < 0.02) {
        npcTypeId = "jailor";
    }
    if (randomFloatRange(0, 1) < 0.04) {
        npcTypeId = "small_jailor";
    }
    if (randomFloatRange(0, 1) < 0.06) {
        npcTypeId = "slime";
    }
    if (randomFloatRange(0, 1) < 0.08) {
        npcTypeId = "small_slime";
    }
    if (stage === 20) {
        npcTypeId = "boss";
    }
    return npcTypeId;
}

function addEnemy(entity: Entity<ScriptState>) {
    const { stage } = entity.getState();
    const serviceLocator = entity.getServiceLocator();
    const severity = stage === 20 ? 1 : ((stage - 1) * 2) + 1;
    for (let x = 0; x < severity; x ++) {
        const randomAdjust = stage === 20 ? {x: 0, y:0} : {
            x: randomFloatRange(-2, 2),
            y: randomFloatRange(-2, 2),
        };
        const spawnPoint = vec.vec_add(
            getSpawnPoint(entity),
            randomAdjust
        );
       
        const enemy = EntityFactory.NPC_BULKY_MAN(serviceLocator, createNPCState({
            position: spawnPoint,
            npcTypeId: getNpcType(stage)
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
                            if (stage === 20) {
                                entity.getServiceLocator().getScriptingService().onBeatGame();
                                return;
                            }
                            entity.setState({
                                levelStage: LevelStage.OPEN_CHEST
                            })
                            addChest(entity);
                            const serviceLocator = entity.getServiceLocator();
                            serviceLocator.getAudioService().playSong(
                                serviceLocator.getResourceManager().manifest.audio[Audios.CHEST_STAGE],
                                undefined,
                                false
                            )
                        }
                    })
                }]),
                [LevelStage.OPEN_CHEST]: JoinComponent([{
                    getActions: (entity: Entity<ScriptState>) => ({
                        onEntityCreated: () => {
                            if (!entity.getServiceLocator().getAudioService().isPlayingSong()) {
                                serviceLocator.getAudioService().playSong(
                                    serviceLocator.getResourceManager().manifest.audio[Audios.CHEST_STAGE],
                                    undefined,
                                    false
                                )
                            }
                        },
                        onChestOpened: () => {
                            const { stage } = entity.getState();
                            entity.setState({
                                stage: stage + 1,
                            })
                            entity.getServiceLocator().getStore().getActions().onStageReached(stage + 1);
                            addEnemy(entity);
                            entity.setState({
                                levelStage: LevelStage.KILL_ENEMIES
                            });
                        }
                    })
                }]),
                [LevelStage.KILL_ENEMIES]: JoinComponent([{
                    getActions: (entity: Entity<ScriptState>) => ({
                        onEntityCreated: () => {
                            if (!entity.getServiceLocator().getAudioService().isPlayingSong()) {
                                serviceLocator.getAudioService().playSong(
                                    serviceLocator.getResourceManager().manifest.audio[Audios.FIGHT],
                                    undefined,
                                    false
                                )
                            }
                        },
                        onEnemyKilled: () => {
                            const { activeEnemies } = entity.getState();
                            const newEnemies = activeEnemies - 1;
                            entity.setState({
                                activeEnemies: newEnemies
                            })
                            if (newEnemies <= 0) {
                                entity.getServiceLocator().getAudioService().play(entity.getServiceLocator().getResourceManager().manifest.audio[Audios.BEAT_ENEMIES]);
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

