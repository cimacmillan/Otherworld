import { Animations } from "../../services/resources/ResourceManager";
import { AnimationDriver } from "../../util/animation/AnimationDriver";
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
import { BaseState } from "../State";
import { PhysicsStateType } from "./PhysicsComponent";
import { SpriteStateType } from "./SpriteRenderComponent";

export type MacatorStateType = BaseState & SpriteStateType & PhysicsStateType;

const WALK_SPEED = 0.005;

export class CrabletLogicComponent<
    T extends MacatorStateType
> extends EntityComponent<T> {
    private animation: AnimationDriver;

    public init(entity: Entity<MacatorStateType>) {
        return {
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 0.4,
            elastic: 0,
        };
    }

    public update(entity: Entity<MacatorStateType>): void {
        if (this.animation) {
            this.animation.tick();
        }
        this.syncSprite(entity);

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

    public onEvent(entity: Entity<MacatorStateType>, event: GameEvent): void {
        switch (event.type) {
            case EntityEventType.ENTITY_CREATED:
                this.onCreate(entity);
                break;
            case EntityEventType.ENTITY_DELETED:
                entity.setState(
                    {
                        toRender: undefined,
                    },
                    true
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
                break;
            case 1:
                crabType = Animations.CRABLET_GREEN;
                break;
            case 2:
                crabType = Animations.CRABLET_BLUE;
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
            },
            true
        );

        const getAnimationTexture = (xTex: number) =>
            entity
                .getServiceLocator()
                .getResourceManager()
                .sprite.getAnimationInterp(crabType, xTex);

        this.animation = new AnimationDriver((x: number) => {
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
        })

            .speed(400)
            .start(Math.random(), true);
    }

    private syncSprite(entity: Entity<MacatorStateType>) {
        const state = entity.getState();
        state.toRender.position = [state.position.x, state.position.y];
    }
}
