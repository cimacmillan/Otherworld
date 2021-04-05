import { Sprites } from "../../../resources/manifests/Sprites";
import { InteractionSource, InteractionType } from "../../../services/interaction/InteractionType";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { onInteractedWith } from "../../components/core/InteractionComponent";
import { PhysicsComponent, PhysicsStateType } from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

type NPCState = SpriteRenderState &
                PhysicsStateType & {};

export function createNPC(
    serviceLocator: ServiceLocator,
    state: NPCState
) {
    return new Entity<NPCState>(
        serviceLocator,
        state,
        SpriteRenderComponent(),
        PhysicsComponent(),
        onInteractedWith(InteractionType.ATTACK, (entity: Entity<NPCState>, source: InteractionSource) => {
            console.log("On interacted by player", source);
        })
    );
}

export function createNPCState(
    args: {
        position: Vector2D;
    }
): NPCState {
    const { position } = args;
    return {
        sprite: Sprites.NPC_BULKY_MAN,
        spriteHeight: 1,
        spriteWidth: 1,
        position,
        height: 0,
        yOffset: 0,
        radius: 0.2,
        angle: 0,
        velocity: { x: 0, y: 0 },
        heightVelocity: 0,
        friction: 0.9,
        mass: 1,
        elastic: 0.9,
        collidesEntities: true,
        collidesWalls: true
    };
}


