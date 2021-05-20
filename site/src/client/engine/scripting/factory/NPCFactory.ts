import { vec3 } from "gl-matrix";
import { InteractionSource, InteractionSourceType, InteractionType } from "../../../services/interaction/InteractionType";
import { DamageTextParticle, HealthDropParticle } from "../../../services/particle/particles/HealthDropParticle";
import { RenderItem, SpriteShadeOverride } from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { animation, easeInOutCirc } from "../../../util/animation/Animations";
import { GameAnimation } from "../../../util/animation/GameAnimation";
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
import { EntityFactory, EntityType } from "./EntityFactory";
import { WhenInPlayerVicinity } from "./ItemFactory";
import { createStaticSpriteState } from "./SceneryFactory";

interface HealthState {
    health: number;
}

enum NPCBehaviour {
    IDLE = "IDLE",
    PURSUING = "PURSUING",
    DAMAGED = "DAMAGED",
    ATTACKING = "ATTACKING"
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

const RendersTextWhenDamaged = () => {
    return ({
        getActions: (entity: Entity<NPCState>) => ({
            onDamagedByPlayer: (points: number) => {
                const { position, height, spriteHeight, health } = entity.getState();
                const vector: vec3 = [position.x, height + spriteHeight/2, position.y];
                entity.getServiceLocator().getParticleService().addParticle(HealthDropParticle({ 
                    damage: health, 
                    start: vector,
                    getAngle: () => entity.getServiceLocator().getScriptingService().getPlayer().getAngle()
                }));
                entity.getServiceLocator().getParticleService().addParticle(DamageTextParticle({ 
                    damage: points, 
                    start: vector,
                    getAngle: () => entity.getServiceLocator().getScriptingService().getPlayer().getAngle()
                }))
            }
        })
    });
}

const WhenHealthDepleted = (callback: (entity: Entity<NPCState>) => void): EntityComponent<NPCState> => {
    return ({
        getActions: (entity: Entity<NPCState>) => ({
            onStateTransition: (from: HealthState, to: HealthState) => {
                if (from.health !== 0 && to.health === 0) {
                    callback(entity);
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

const OnDamagedByPlayer = (onDamaged: (entity: Entity<NPCState>) => void) => {
    return {
        getActions: (entity: Entity<NPCState>) => ({
            onDamagedByPlayer: () => onDamaged(entity)
        })
    }
}

const WalksTowardsPlayer = (): EntityComponent<PhysicsStateType> => {
    return ({
        getActions: (entity: Entity<PhysicsStateType>) => ({

        }),
        update: (entity: Entity<PhysicsStateType>) => {
            const playerPos = entity.getServiceLocator().getScriptingService().getPlayer().getPositon();
            const pos = entity.getState().position;
            const diff = vec.vec_sub(playerPos, pos);
            const norm = vec.vec_normalize(diff);
            const speed = vec.vec_mult_scalar(norm, 0.004);
            const newVelocity = vec.vec_add(entity.getState().velocity, speed);
            entity.setState({
                velocity: newVelocity
            })
        }
    })
}

const IdleBehaviour = (state: NPCState, visibleDistance: number): EntityComponent<NPCState>[] => {
    return [
        OnDamagedByPlayer(ent => ent.setState({ behaviour: NPCBehaviour.DAMAGED })),
        BreathsSlowly(state.spriteHeight),
        WhenInPlayerVicinity(visibleDistance, (entity: Entity<NPCState>) => {
            entity.setState({
                behaviour: NPCBehaviour.PURSUING
            })
        }, (entity: Entity<NPCState>) => {})
    ];
}

const PursuingBehaviour = (state: NPCState, attackDistance: number): EntityComponent<NPCState>[] => {
    let anim: GameAnimation;
    let prevX: number = 0;
    return [
        OnDamagedByPlayer(ent => ent.setState({ behaviour: NPCBehaviour.DAMAGED })),
        WalksTowardsPlayer(),
        WhenInPlayerVicinity(attackDistance, (entity: Entity<NPCState>) => {
            entity.setState({
                behaviour: NPCBehaviour.ATTACKING
            })
        }, (entity: Entity<NPCState>) => {}),
        AnimationComponent((entity: Entity<NPCState>) => {
            anim = animation((x) => {
                const sprite = entity.getServiceLocator().getResourceManager().getDefaultSpriteSheet().getAnimationInterp("npc_bulky_man_run", x);
                entity.setState({
                    sprite: sprite.textureCoordinate
                });

                if ((prevX < 0.25 && x > 0.25) || (prevX < 0.75 && x > 0.75)) {
                    entity.getServiceLocator().getRenderService().screenShakeService.shake(0.3);
                }
                prevX = x;
            }).looping();
            return anim;
        }),
        {
            getActions: (entity: Entity<NPCState>) => ({
                onEntityDeleted: () => {
                    entity.setState({
                        sprite: "npc_bulky_man"
                    })
                }
            }),
            update: (entity: Entity<NPCState>) => {
                const speed = vec.vec_distance(entity.getState().velocity);
                const animationSpeed = 50 / speed;
                anim && anim.speed(animationSpeed);
            }
        }
    ];
}

const COLOUR_HIT_TIME = 200;
const HitBehaviour = (state: NPCState): EntityComponent<NPCState>[] => {
    return [
        {
        getActions: (entity: Entity<NPCState>) => ({
            onEntityCreated: () => {
                entity.setState({
                    shade: whiteShade,
                    spriteWidth: 1.1,
                    spriteHeight: 1.1
                });
            },
            onEntityDeleted: () => {
                entity.setState({
                    shade: undefined,
                    spriteWidth: 1,
                    spriteHeight: 1
                });
            }
        })
        },
        TimeoutComponent<NPCState>((entity: Entity<NPCState>) => {
            entity.setState({
                behaviour: NPCBehaviour.IDLE
            })
        }, COLOUR_HIT_TIME)
    ];
}

const AttackingBehaviour = (state: NPCState): EntityComponent<NPCState>[] => {
    return [
        OnDamagedByPlayer(ent => ent.setState({ behaviour: NPCBehaviour.DAMAGED })),
        {
            getActions: (entity: Entity<NPCState>) => ({
                onEntityCreated: () => {
                    entity.getServiceLocator().getScriptingService().getPlayer().onDamage(1);
                }
            })
        }
    ];
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
        WhenHealthDepleted((entity: Entity<NPCState>) => {
            entity.delete();
            const newStaticSprite = EntityFactory[EntityType.SCENERY_SPRITE](serviceLocator, createStaticSpriteState(
                "dead_man",
                entity.getState().position,
                0,
                entity.getState().spriteWidth,
                entity.getState().spriteHeight
            ));
            newStaticSprite.create();
        }),
        new SwitchComponent(
            {
                [NPCBehaviour.IDLE]: JoinComponent(IdleBehaviour(state, 8)),
                [NPCBehaviour.PURSUING]: JoinComponent(PursuingBehaviour(state, 1)),
                [NPCBehaviour.DAMAGED]: JoinComponent(HitBehaviour(state)),
                [NPCBehaviour.ATTACKING]: JoinComponent(AttackingBehaviour(state)),
            }, 
            state.behaviour, 
            (entity: Entity<NPCState>) => entity.getState().behaviour
        ),
        RendersTextWhenDamaged()
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
        sprite: "npc_bulky_man",
        spriteHeight: 1,
        spriteWidth: 1,
        position,
        height: 0,
        yOffset: 0,
        radius: 0.6,
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


