import { Audios } from "../../../resources/manifests/Audios";
import { InteractionType } from "../../../services/interaction/InteractionType";
import { ProcedureService } from "../../../services/jobs/ProcedureService";
import { BurstEmitter, BurstEmitterType } from "../../../services/particle/emitters/BurstEmitter";
import { GravityDropParticle } from "../../../services/particle/particles/GravityDropParticle";
import { SmokeParticle } from "../../../services/particle/particles/SmokeParticle";
import { SparkleParticle } from "../../../services/particle/particles/SparkleParticle";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { randomSelection } from "../../../util/math/Random";
import { DropItemDistribution } from "../../commands/ItemCommands";
import { DeregisterKeyHint, RegisterKeyHint } from "../../commands/UICommands";
import { InteractionStateType, onCanBeInteractedWithByPlayer, onInteractedWith } from "../../components/core/InteractionComponent";
import { PhysicsComponent, PhysicsStateType } from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { JoinComponent } from "../../components/util/JoinComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { TimeoutComponent } from "../../components/util/TimeoutEffect";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";
import { ItemDropDistribution } from "../items/ItemDrops";

interface ChestState {
    opened: boolean;
    itemDrops: ItemDropDistribution;
}

type ChestStateType = SpriteRenderState & ChestState & InteractionStateType;

export function createChest(
    serviceLocator: ServiceLocator,
    state: ChestStateType
) {
    let interactHintId: number = undefined;
    return new Entity<ChestStateType>(
        serviceLocator,
        state,
        SpriteRenderComponent(),
        new SwitchComponent(
            {
                "false": JoinComponent([
                    onInteractedWith<ChestStateType>(
                        InteractionType.INTERACT,
                        (ent, source) => {
                            ent.setState({
                                opened: true,
                            });
                            if (interactHintId !== undefined) {
                                DeregisterKeyHint(serviceLocator)(interactHintId);
                            }
                            const { itemDrops, position } = ent.getState();
                            DropItemDistribution(serviceLocator, itemDrops, position, { x: 0, y: 0 }, true);
                            serviceLocator.getAudioService().play3D(
                                serviceLocator.getResourceManager().manifest.audio[
                                    randomSelection([Audios.CHEST_OPEN_0, Audios.CHEST_OPEN_1])
                                ],
                                [position.x, position.y]
                            );
                            serviceLocator.getAudioService().playSong(
                                serviceLocator.getResourceManager().manifest.audio[Audios.FIGHT]
                            )
                        }
                    ),
                    onCanBeInteractedWithByPlayer(
                        InteractionType.INTERACT,
                        () => {
                            interactHintId = RegisterKeyHint(serviceLocator)({
                                code: ["E"],
                                hint: "Open Chest",
                            });
                        },
                        () => {
                            if (interactHintId !== undefined) {
                                DeregisterKeyHint(serviceLocator)(interactHintId);
                            }
                        }
                    ),
                    {
                        getActions: (entity: Entity<ChestStateType>) => ({
                            onEntityCreated: () => {
                                const position = entity.getState().position;
                                const smokeEmitter = BurstEmitter({
                                    creator: pos => SmokeParticle({
                                        start: pos
                                    }),
                                    position: [position.x, 0.5, position.y],
                                    rate: 0.5
                                });
                                entity.getServiceLocator().getParticleService().addEmitter(smokeEmitter.emitter);
                                ProcedureService.setGameTimeout(() => {
                                    entity.getServiceLocator().getParticleService().removeEmitter(smokeEmitter.emitter);
                                }, 500);
                            }
                        })
                    }
                ]),
                "true": JoinComponent([
                    {
                        getActions: (entity: Entity<ChestStateType>) => ({
                            onEntityCreated: () => {
                                const position = entity.getState().position;
                                entity.setState({
                                    sprite: "chest_closed"
                                });
                                const emitter = BurstEmitter({
                                    creator: pos => SparkleParticle({
                                        start: pos
                                    }),
                                    position: [position.x, 0.5, position.y],
                                    rate: 1
                                });
                                entity.getServiceLocator().getParticleService().addEmitter(emitter.emitter);
                                ProcedureService.setGameTimeout(() => {
                                    entity.getServiceLocator().getParticleService().removeEmitter(emitter.emitter);
                                }, 300);
                            }
                        })
                    },
                    TimeoutComponent((entity: Entity<ChestStateType>) => {                                const position = entity.getState().position;
                        const pos = entity.getState().position;
                        entity.delete();
                        entity.getServiceLocator().getWorld().forEachEntity(ent => ent.getActions().onChestOpened());
                        const smokeEmitter = BurstEmitter({
                            creator: pos => SmokeParticle({
                                start: pos
                            }),
                            position: [pos.x, 0.5, pos.y],
                            rate: 0.5
                        });
                        entity.getServiceLocator().getParticleService().addEmitter(smokeEmitter.emitter);
                        ProcedureService.setGameTimeout(() => {
                            entity.getServiceLocator().getParticleService().removeEmitter(smokeEmitter.emitter);
                        }, 500);
                        serviceLocator.getAudioService().play(
                            serviceLocator.getResourceManager().manifest.audio[
                                randomSelection([Audios.CHEST_DISAPPEAR])
                            ]
                        );
                    }, 3000)
                ])
            }, 
            `${state.opened}`, 
            ent => `${ent.getState().opened}`
        )
    )
}

export function createChestState(
    position: Vector2D,
    itemDrops: ItemDropDistribution,
): ChestStateType {
    return {
        yOffset: 0,
        position,
        height: 0,
        radius: 1,
        angle: 0,
        sprite: "chest_open",
        spriteWidth: 1,
        spriteHeight: 1,
        opened: false,
        itemDrops
    };
}


