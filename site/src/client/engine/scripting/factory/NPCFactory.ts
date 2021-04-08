import { Sprites } from "../../../resources/manifests/Sprites";
import { InteractionSource, InteractionSourceType, InteractionType } from "../../../services/interaction/InteractionType";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { animation, easeInOutCirc } from "../../../util/animation/Animations";
import { CanBeInteractedWith, onInteractedWith } from "../../components/core/InteractionComponent";
import { PhysicsComponent, PhysicsStateType } from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { SpriteRenderState } from "../../state/State";

interface HealthState {
    health: number;
}

enum NPCBehaviour {
    IDLE = "IDLE",
    DEAD = "DEAD"
}

type NPCState = SpriteRenderState &
                PhysicsStateType &
                HealthState & {
                    behaviour: NPCBehaviour
                };


const LosesHealthWhenDamaged = () => {
    return ({
        getActions: (entity: Entity<HealthState>) => ({
            onDamagedByPlayer: (points: number) => {
                console.log("oof");

                let health = entity.getState().health - points;
                health = health < 0 ? 0 : health;
                entity.setState({
                    health
                })
            }
        })
    })
}

const WhenHealthDepleted = (callback: () => void): EntityComponent<HealthState> => {
    return ({
        getActions: () => ({
            onStateTransition: (from: HealthState, to: HealthState) => {
                if (from.health !== 0 && to.health === 0) {
                    callback();
                }
            }
        })
    })
}

const BREATH_DIFF = 0.02;
const BREATH_FREQUENCY = 3000;
const BreathsSlowly = (defaultHeight: number): EntityComponent<SpriteRenderState> => {
    const amplitude = BREATH_DIFF * defaultHeight;
    return AnimationComponent((entity: Entity<SpriteRenderState>) => {
        return animation((x: number) => {
            entity.setState({
                spriteHeight: defaultHeight + amplitude * x
            });
        }).speed(BREATH_FREQUENCY).tween(
            (x) => Math.cos(2 * Math.PI * x)
            ).looping()
    });
}

export function createNPC(
    serviceLocator: ServiceLocator,
    state: NPCState
) {
    return new Entity<NPCState>(
        serviceLocator,
        state,
        SpriteRenderComponent(),
        PhysicsComponent(),
        CanBeInteractedWith(InteractionType.ATTACK),
        LosesHealthWhenDamaged(),
        WhenHealthDepleted(() => {
            console.log("He died :(")
        }),
        BreathsSlowly(state.spriteHeight)
    )
}

export function createNPCState(
    args: {
        position: Vector2D;
        health: number;
    }
): NPCState {
    const { position, health } = args;
    return {
        behaviour: NPCBehaviour.IDLE,
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
        collidesWalls: true,
        health
    };
}


