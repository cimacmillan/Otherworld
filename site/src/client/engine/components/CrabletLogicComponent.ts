import { Animations, Sprites } from "../../services/resources/ResourceManager";
import { TextureCoordinate } from "../../services/resources/SpriteSheet";
import { GameAnimation } from "../../util/animation/Animation";
import {
    vec_add,
    vec_mult_scalar,
    vec_normalize,
    vec_sub,
} from "../../util/math";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
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

const WALK_SPEED = 0.01;

export class CrabletLogicComponent<
    T extends MacatorStateType
> extends EntityComponent<T> {
    private animation: GameAnimation;
    private deadTexture: TextureCoordinate;

    public init(entity: Entity<MacatorStateType>) {
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
        }
        this.syncSprite(entity);

        if (entity.getState().macatorState === MacatorState.WALKING) {
            const playerPos = entity
                .getServiceLocator()
                .getScriptingService()
                .getPlayer()
                .getState().position;
            const macatorPos = entity.getState().position;
            const direction = vec_normalize(vec_sub(playerPos, macatorPos));

            entity.getState().velocity = vec_add(
                entity.getState().velocity,
                vec_mult_scalar(direction, WALK_SPEED)
            );
        }
    }

    public onEvent(entity: Entity<MacatorStateType>, event: GameEvent): void {
        switch (event.type) {
            case EntityEventType.ENTITY_CREATED:
                this.onCreate(entity);
                break;
            case EntityEventType.ENTITY_DELETED:
                break;
            case EntityEventType.STATE_TRANSITION:
                this.onStateTransition(
                    entity,
                    event.payload.from as MacatorStateType,
                    event.payload.to as MacatorStateType
                );
                break;
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

    private onCreate(entity: Entity<MacatorStateType>) {
        const x = -(Math.random() * 20) + 10;
        const y = -(Math.random() * 20) + 10;
        const xtex = Math.random();

        let crabType = Animations.CRABLET_BROWN;

        switch (Math.floor(Math.random() * 3)) {
            case 0:
                crabType = Animations.CRABLET_BROWN;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .sprite.getSprite(
                        Sprites.MACATOR_DEAD_BROWN
                    ).textureCoordinate;
                break;
            case 1:
                crabType = Animations.CRABLET_GREEN;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .sprite.getSprite(
                        Sprites.MACATOR_DEAD_GREEN
                    ).textureCoordinate;
                break;
            case 2:
                crabType = Animations.CRABLET_BLUE;
                this.deadTexture = entity
                    .getServiceLocator()
                    .getResourceManager()
                    .sprite.getSprite(
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
                        .sprite.getAnimationInterp(crabType, xtex),
                },
                position: { x, y },
                height: 0.5,
                radius: 0.5,
                angle: 0,
                collides: true,
                interactable: {
                    ATTACK: true,
                },
            },
            true
        );

        const getAnimationTexture = (xTex: number) =>
            entity
                .getServiceLocator()
                .getResourceManager()
                .sprite.getAnimationInterp(crabType, xTex);

        this.animation = new GameAnimation((x: number) => {
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
        })
            .speed(400)
            .start({ offset: Math.random(), loop: true });
    }

    private syncSprite(entity: Entity<MacatorStateType>) {
        const state = entity.getState();
        state.toRender.position = [state.position.x, state.position.y];
    }

    private onStateTransition(
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

    private onDamaged(
        entity: Entity<MacatorStateType>,
        amount: number,
        source?: SurfacePositionState
    ) {
        if (entity.getState().macatorState !== MacatorState.WALKING) {
            return;
        }

        const state = entity.getState();
        state.velocity = vec_add(state.velocity, {
            x: Math.sin(source.angle) * 0.3,
            y: -Math.cos(source.angle) * 0.3,
        });

        state.health -= amount;

        if (state.health <= 0) {
            entity.setState({
                macatorState: MacatorState.DYING,
            });
        } else {
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
            this.animation.stop();

            const texture = entity
                .getServiceLocator()
                .getResourceManager()
                .sprite.getSprite(Sprites.MACATOR_DAMAGED);
            const toRender = entity.getState().toRender;
            toRender.textureX = texture.textureCoordinate.textureX;
            toRender.textureY = texture.textureCoordinate.textureY;
            toRender.textureWidth = texture.textureCoordinate.textureWidth;
            toRender.textureHeight = texture.textureCoordinate.textureHeight;

            setTimeout(
                () =>
                    entity.setState({
                        macatorState: MacatorState.WALKING,
                    }),
                200
            );
        }

        if (to === MacatorState.WALKING) {
            this.animation.start({ loop: true });
        }

        if (to === MacatorState.DYING) {
            this.animation.stop();
            const toRender = entity.getState().toRender;
            toRender.textureX = this.deadTexture.textureX;
            toRender.textureY = this.deadTexture.textureY;
            toRender.textureWidth = this.deadTexture.textureWidth;
            toRender.textureHeight = this.deadTexture.textureHeight;
            entity
                .getServiceLocator()
                .getAudioService()
                .play(entity.getServiceLocator().getResourceManager().point);
        }
    }
}
