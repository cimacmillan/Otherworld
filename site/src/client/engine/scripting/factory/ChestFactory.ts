import { InteractionType } from "../../../services/interaction/InteractionType";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
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
                ]),
                "true": JoinComponent([
                    {
                        getActions: (entity: Entity<ChestStateType>) => ({
                            onEntityCreated: () => {
                                entity.setState({
                                    sprite: "chest_closed"
                                })
                            }
                        })
                    },
                    TimeoutComponent((entity: Entity<ChestStateType>) => {
                        entity.delete();
                    }, 2000)
                ])
            }, 
            "false", 
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
        radius: 0.5,
        angle: 0,
        sprite: "chest_open",
        spriteWidth: 1,
        spriteHeight: 1,
        opened: false,
        itemDrops
    };
}


