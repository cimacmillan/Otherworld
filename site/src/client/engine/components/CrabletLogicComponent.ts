import { InteractionType } from "../../services/interaction/InteractionType";
import {
    Animations,
    Audios,
    Sprites,
    SpriteSheets,
} from "../../services/resources/manifests/Types";
import { TextureCoordinate } from "../../services/resources/SpriteSheet";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import {
    vec_add,
    vec_distance,
    vec_mult_scalar,
    vec_normalize,
    vec_sub,
} from "../../util/math";
import { ActionDelay } from "../../util/time/ActionDelay";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EnemyEventType } from "../events/EnemyEvents";
import { GameEvent } from "../events/Event";
import { InteractionEventType } from "../events/InteractionEvents";
import { BaseState, HealthState, SurfacePositionState } from "../State";
import { InteractionStateType } from "./InteractionComponent";
import { PhysicsStateType } from "./physics/PhysicsComponent";
import { SpriteStateType } from "./rendering/SpriteRenderComponent";

enum MacatorState {
    WALKING = "WALKING",
    DAMAGED = "DAMAGED",
    DYING = "DYING",
    ATTACKING = "ATTACKING",
}

interface Macator {
    macatorState: MacatorState;
}

export type MacatorStateType = BaseState &
    SpriteStateType &
    PhysicsStateType &
    InteractionStateType &
    Macator &
    HealthState;

const WALK_SPEED = 0.008;
const ATTACK_SPEED = 0.03;
const SPY_RADIUS = 20;
const ATTACK_DELAY = 2000;
const ATTACK_DISTANCE = 0.6;
const DEFAULT_HEIGHT = 0.5;
const JUMP_HEIGHT = 0.25;

export class CrabletLogicComponent<
    T extends MacatorStateType
> extends EntityComponent<T> {
    private animation: GameAnimation;
    private attackAnimation: GameAnimation;
    private deadTexture: TextureCoordinate;
    private attackDelay: ActionDelay;

    public constructor(private initialX: number, private initialY: number) {
        super();
    }

    public init(entity: Entity<MacatorStateType>) {
        this.attackDelay = new ActionDelay(ATTACK_DELAY);
        return {
            macatorState: MacatorState.WALKING,
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 0.4,
            elastic: 0,
            health: 1,
        };
    }

    public update(entity: Entity<MacatorStateType>): void {
        if (this.animation) {
            this.animation.tick();
            this.attackAnimation.tick();
        }
        this.syncSprite(entity);

        const playerPos = entity
            .getServiceLocator()
            .getScriptingService()
            .getPlayer()
            .getState().position;
        const macatorPos = entity.getState().position;
        const macatorState = entity.getState().macatorState;

        if (
            macatorState === MacatorState.WALKING ||
            macatorState === MacatorState.ATTACKING
        ) {
            const direction = vec_normalize(vec_sub(playerPos, macatorPos));

            let speed = WALK_SPEED;
            speed =
                macatorState === MacatorState.ATTACKING ? ATTACK_SPEED : speed;

            entity.getState().velocity = vec_add(
                entity.getState().velocity,
                vec_mult_scalar(direction, speed)
            );
        }

        if (macatorState === MacatorState.WALKING) {
            if (
                vec_distance(vec_sub(playerPos, macatorPos)) < SPY_RADIUS &&
                this.attackDelay.canAction()
            ) {
                entity.setState({
                    macatorState: MacatorState.ATTACKING,
                });
            }
        }

        if (macatorState === MacatorState.ATTACKING) {
            if (
                vec_distance(vec_sub(playerPos, macatorPos)) < ATTACK_DISTANCE
            ) {
                this.attackDelay.onAction();
                entity.setState({
                    macatorState: MacatorState.WALKING,
                });

                entity
                    .getServiceLocator()
                    .getScriptingService()
                    .getPlayer()
                    .emit({
                        type: InteractionEventType.ON_DAMAGED,
                        payload: {
                            amount: 0.02,
                        },
                    });
            }
        }
    }

    public onEvent(entity: Entity<MacatorStateType>, event: GameEvent): void {
        switch (event.type) {
            case InteractionEventType.ON_DAMAGED:
                this.onDamaged(
                    entity,
                    event.payload.amount,
                    event.payload.source
                );
                break;
        }
    }

    public onObservedEvent(
        entity: Entity<MacatorStateType>,
        event: GameEvent
    ): void {}

    public onCreate(entity: Entity<MacatorStateType>) {
        const angle = Math.random() * Math.PI * 2;
        const x = this.initialX;
        const y = this.initialY;
        const xtex = Math.random();

        let crabType = Animations.CRABLET_BROWN;
        let crabAttackAnimation = Animations.CRABLET_BROWN_ATTACK;

        switch (Math.floor(Math.random() * 3)) {
            case 0:
                crabType = Animations.CRABLET_BROWN;
                crabAttackAnimation = Animations.CRABLET_BROWN_ATTACK;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                        Sprites.MACATOR_DEAD_BROWN
                    ).textureCoordinate;
                break;
            case 1:
                crabType = Animations.CRABLET_GREEN;
                crabAttackAnimation = Animations.CRABLET_GREEN_ATTACK;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                        Sprites.MACATOR_DEAD_GREEN
                    ).textureCoordinate;
                break;
            case 2:
                crabType = Animations.CRABLET_BLUE;
                crabAttackAnimation = Animations.CRABLET_BLUE_ATTACK;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                        Sprites.MACATOR_DEAD_BLUE
                    ).textureCoordinate;
                break;
        }

        entity.setState(
            {
                spriteState: {
                    sprite: {
                        position: [x, y],
                        size: [1, 1],
                        height: 0.5,
                        texture: entity
                            .getServiceLocator()
                            .getResourceManager()
                            .manifest.spritesheets[
                                SpriteSheets.SPRITE
                            ].getAnimationInterp(crabType, xtex)
                            .textureCoordinate,
                    },
                },
                position: { x, y },
                height: DEFAULT_HEIGHT,
                radius: 0.5,
                angle: 0,
                collides: true,
                interactable: {
                    ATTACK: true,
                },
            },
            true
        );

        const getAnimationTexture = (crabType: number, xTex: number) =>
            entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE].getAnimationInterp(
                    crabType,
                    xTex
                );

        this.animation = new GameAnimation((x: number) => {
            const toRender = entity.getState().spriteState.sprite;
            toRender.texture = getAnimationTexture(
                crabType,
                x
            ).textureCoordinate;
        })
            .speed(400)
            .withOffset(Math.random())
            .looping()
            .start();

        this.attackAnimation = new GameAnimation((x: number) => {
            const toRender = entity.getState().spriteState.sprite;
            toRender.texture = getAnimationTexture(
                crabAttackAnimation,
                x
            ).textureCoordinate;
            toRender.height =
                DEFAULT_HEIGHT + Math.sin(x * Math.PI) * JUMP_HEIGHT;
        }).speed(400);
    }

    public onDestroy(entity: Entity<MacatorStateType>) {}

    public onStateTransition(
        entity: Entity<MacatorStateType>,
        from: MacatorStateType,
        to: MacatorStateType
    ) {
        if (from.macatorState !== to.macatorState) {
            this.onMacatorStateChange(
                entity,
                from.macatorState,
                to.macatorState
            );
        }
    }

    private syncSprite(entity: Entity<MacatorStateType>) {
        const state = entity.getState();
        state.spriteState.sprite.position = [
            state.position.x,
            state.position.y,
        ];
    }

    private onDamaged(
        entity: Entity<MacatorStateType>,
        amount: number,
        source?: SurfacePositionState
    ) {
        if (
            entity.getState().macatorState !== MacatorState.WALKING &&
            entity.getState().macatorState !== MacatorState.ATTACKING
        ) {
            return;
        }

        const state = entity.getState();
        state.health -= amount;

        if (state.health <= 0) {
            state.velocity = vec_add(state.velocity, {
                x: Math.sin(source.angle) * 0.5,
                y: -Math.cos(source.angle) * 0.5,
            });

            entity.setState({
                macatorState: MacatorState.DYING,
            });
        } else {
            state.velocity = vec_add(state.velocity, {
                x: Math.sin(source.angle) * 0.3,
                y: -Math.cos(source.angle) * 0.3,
            });

            entity.setState({
                macatorState: MacatorState.DAMAGED,
            });
        }
    }

    private onMacatorStateChange(
        entity: Entity<MacatorStateType>,
        from: MacatorState,
        to: MacatorState
    ) {
        if (to === MacatorState.DAMAGED) {
            entity.getState().spriteState.sprite.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.stop();

            const texture = entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                    Sprites.MACATOR_DAMAGED
                );
            const toRender = entity.getState().spriteState.sprite;
            toRender.texture = texture.textureCoordinate;

            animation((x: number) => {
                toRender.size[0] = 0.5 + x;
                toRender.size[1] = 0.5 + x;
            })
                .driven()
                .tween((x: number) => Math.sin(x * Math.PI))
                .speed(200)
                .start()
                .whenDone(() => {
                    toRender.size[0] = 1;
                    toRender.size[1] = 1;
                });

            setTimeout(
                () =>
                    entity.setState({
                        macatorState: MacatorState.WALKING,
                    }),
                200
            );
        }

        if (to === MacatorState.WALKING) {
            entity.getState().spriteState.sprite.height = DEFAULT_HEIGHT;
            this.animation.looping().start();
            this.attackAnimation.stop();
        }

        if (to === MacatorState.ATTACKING) {
            entity.getState().spriteState.sprite.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.start().whenDone(() => {
                entity.setState({
                    macatorState: MacatorState.WALKING,
                });
                this.attackDelay.onAction();
            });
            entity
                .getServiceLocator()
                .getAudioService()
                .play3D(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.HISS],
                    [entity.getState().position.x, entity.getState().position.y]
                );
        }

        if (to === MacatorState.DYING) {
            entity.getState().spriteState.sprite.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.stop();
            const texture = entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                    Sprites.MACATOR_DAMAGED
                );
            const toRender = entity.getState().spriteState.sprite;
            toRender.texture = texture.textureCoordinate;

            setTimeout(() => {
                const toRender = entity.getState().spriteState.sprite;
                toRender.texture = this.deadTexture;
            }, 200);

            entity
                .getServiceLocator()
                .getInteractionService()
                .unregisterEntity(entity, InteractionType.ATTACK);

            entity
                .getServiceLocator()
                .getAudioService()
                .play(
                    entity.getServiceLocator().getResourceManager().manifest
                        .audio[Audios.POINT]
                );

            entity.emitGlobally({
                type: EnemyEventType.ENEMY_KILLED,
            });
        }
    }
}
