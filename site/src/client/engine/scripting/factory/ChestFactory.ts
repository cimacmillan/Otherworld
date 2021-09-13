import { InteractionType } from "../../../services/interaction/InteractionType";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { DeregisterKeyHint, RegisterKeyHint } from "../../commands/UICommands";
import { InteractionStateType, onCanBeInteractedWithByPlayer, onInteractedWith } from "../../components/core/InteractionComponent";
import { PhysicsComponent, PhysicsStateType } from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { JoinComponent } from "../../components/util/JoinComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

interface ChestState {
    opened: boolean
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
                    }
                ])
            }, 
            "false", 
            ent => `${ent.getState().opened}`
        )
    )
}

export function createChestState(
    position: Vector2D
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
        opened: false
    };
}


