import { InteractionType } from "../../services/interaction/InteractionType";
import {
    Animations,
    Audios,
    Sprites,
    SpriteSheets,
} from "../../services/resources/manifests/DefaultManifest";
import { TextureCoordinate } from "../../services/resources/SpriteSheet";
import { GameAnimation } from "../../util/animation/Animation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
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
import { GameEvent } from "../events/Event";
import { InteractionEventType } from "../events/InteractionEvents";
import { BaseState, HealthState, SurfacePositionState } from "../State";
import { InteractionStateType } from "./InteractionComponent";
import { PhysicsStateType } from "./PhysicsComponent";
import { SpriteStateType } from "./SpriteRenderComponent";

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
const SPY_RADIUS = 6;
const ATTACK_DELAY = 2000;
const ATTACK_DISTANCE = 1;
const DEFAULT_HEIGHT = 0.5;
const JUMP_HEIGHT = 0.25;

export class CrabletLogicComponent<
    T extends MacatorStateType
> extends EntityComponent<T> {
    private animation: GameAnimation;
    private attackAnimation: GameAnimation;
    private deadTexture: TextureCoordinate;
    private attackDelay: ActionDelay;

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
        const x = -(Math.random() * 20) + 10;
        const y = -(Math.random() * 20) + 10;
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
                toRender: {
                    position: [x, y],
                    size: [1, 1],
                    height: 0.5,
                    ...entity
                        .getServiceLocator()
                        .getResourceManager()
                        .manifest.spritesheets[
                            SpriteSheets.SPRITE
                        ].getAnimationInterp(crabType, xtex),
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
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(crabType, x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
        })
            .speed(400)
            .start({ offset: Math.random(), loop: true });

        this.attackAnimation = new GameAnimation((x: number) => {
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(crabAttackAnimation, x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
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
        state.toRender.position = [state.position.x, state.position.y];
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
            entity.getState().toRender.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.stop();

            const texture = entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                    Sprites.MACATOR_DAMAGED
                );
            const toRender = entity.getState().toRender;
            toRender.textureX = texture.textureCoordinate.textureX;
            toRender.textureY = texture.textureCoordinate.textureY;
            toRender.textureWidth = texture.textureCoordinate.textureWidth;
            toRender.textureHeight = texture.textureCoordinate.textureHeight;

            new GameAnimation((x: number) => {
                toRender.size[0] = 0.5 + x;
                toRender.size[1] = 0.5 + x;
            }, new IntervalDriver())
                .tween((x: number) => Math.sin(x * Math.PI))
                .speed(200)
                .start({
                    onFinish: () => {
                        toRender.size[0] = 1;
                        toRender.size[1] = 1;
                    },
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
            entity.getState().toRender.height = DEFAULT_HEIGHT;
            this.animation.start({ loop: true });
            this.attackAnimation.stop();
        }

        if (to === MacatorState.ATTACKING) {
            entity.getState().toRender.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.start({
                onFinish: () => {
                    entity.setState({
                        macatorState: MacatorState.WALKING,
                    });
                    this.attackDelay.onAction();
                },
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
            entity.getState().toRender.height = DEFAULT_HEIGHT;
            this.animation.stop();
            this.attackAnimation.stop();
            const texture = entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                    Sprites.MACATOR_DAMAGED
                );
            const toRender = entity.getState().toRender;
            toRender.textureX = texture.textureCoordinate.textureX;
            toRender.textureY = texture.textureCoordinate.textureY;
            toRender.textureWidth = texture.textureCoordinate.textureWidth;
            toRender.textureHeight = texture.textureCoordinate.textureHeight;

            setTimeout(() => {
                const toRender = entity.getState().toRender;
                toRender.textureX = this.deadTexture.textureX;
                toRender.textureY = this.deadTexture.textureY;
                toRender.textureWidth = this.deadTexture.textureWidth;
                toRender.textureHeight = this.deadTexture.textureHeight;
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
        }
    }
}
