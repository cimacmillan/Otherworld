import { Sprites } from "../../../resources/manifests/Sprites";
import { InteractionSource, InteractionSourceType, InteractionType } from "../../../services/interaction/InteractionType";
import { SpriteShadeOverride } from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { animation, easeInOutCirc } from "../../../util/animation/Animations";
import { vec } from "../../../util/math/Vector";
import { CanBeInteractedWith, onInteractedWith } from "../../components/core/InteractionComponent";
import { PhysicsComponent, PhysicsStateType } from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { JoinComponent } from "../../components/util/JoinComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { TimeoutComponent } from "../../components/util/TimeoutEffect";
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
                } & ColourHitState;


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

const ReboundsWhenDamaged = (force = 0.1) => {
    return ({
        getActions: (entity: Entity<PhysicsStateType>) => ({
            onDamagedByPlayer: (points: number) => {
                const { velocity, position } = entity.getState();
                const playerPosition = entity.getServiceLocator().getScriptingService().getPlayer().getPositon();
                const direction = vec.vec_normalize(vec.vec_sub(position, playerPosition));
                const forceVector = vec.vec_mult_scalar(direction, force);
                const newVelocity = vec.vec_add(velocity, forceVector);
                entity.setState({
                    velocity: newVelocity
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

type ColourHitState = {
    colourHit: "DEFAULT" | "COLOUR"
} & SpriteRenderState;
const COLOUR_HIT_TIME = 200;
const TemporaryEffectComponentWhenDamaged = (state: ColourHitState, onEffect: (entity: Entity<ColourHitState>) => void, onDefault: (entity: Entity<ColourHitState>) => void): EntityComponent<ColourHitState> => {
    return new SwitchComponent<ColourHitState>(
        {
            ["DEFAULT"]: {
                getActions: (entity: Entity<ColourHitState>) => ({
                    onEntityCreated: () => {
                        onDefault(entity);
                    },
                    onDamagedByPlayer: () => {
                        entity.setState({
                            colourHit: "COLOUR"
                        })
                    }
                })
            },
            ["COLOUR"]: JoinComponent<ColourHitState>([
                {
                    getActions: (entity: Entity<ColourHitState>) => ({
                        onEntityCreated: () => {
                            onEffect(entity);
                        }
                    })
                },
                TimeoutComponent<ColourHitState>((entity: Entity<ColourHitState>) => {
                    entity.setState({
                        colourHit: "DEFAULT"
                    })
                }, COLOUR_HIT_TIME)
            ])
        },
        state.colourHit,
        (entity: Entity<ColourHitState>) => entity.getState().colourHit
    );
}

const whiteShade = {
    intensity: 1,
    r: 1,
    g: 1, 
    b: 1
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
        ReboundsWhenDamaged(),
        TemporaryEffectComponentWhenDamaged(
            state, 
            (entity: Entity<NPCState>) => entity.setState({
                shade: whiteShade,
                spriteWidth: 1.1,
                spriteHeight: 1.1
            }),
            (entity: Entity<NPCState>) => entity.setState({
                shade: undefined,
                spriteWidth: 1,
                spriteHeight: 1
            }),
        ),
        WhenHealthDepleted(() => {
            console.log("He died :(")
        }),
        new SwitchComponent(
            {
                "DEFAULT": BreathsSlowly(state.spriteHeight)
            }, 
            state.colourHit, 
            (entity: Entity<ColourHitState>) => entity.getState().colourHit
        )
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
        radius: 0.4,
        angle: 0,
        velocity: { x: 0, y: 0 },
        heightVelocity: 0,
        friction: 0.9,
        mass: 1,
        elastic: 0.9,
        collidesEntities: true,
        collidesWalls: true,
        health,
        colourHit: "DEFAULT"
    };
}


