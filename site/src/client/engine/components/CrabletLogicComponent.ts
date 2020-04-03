import { AnimationDriver } from "../../util/animation/AnimationDriver";
import { floorStepper } from "../../util/animation/TweenFunction";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { SpriteStateType } from "./SpriteRenderComponent";

export class CrabletLogicComponent<
    T extends SpriteStateType
> extends EntityComponent<T> {
    private animation: AnimationDriver;

    public init(entity: Entity<SpriteStateType>) {
        return {};
    }

    public update(entity: Entity<SpriteStateType>): void {
        if (this.animation) {
            this.animation.tick();
        }
    }

    public onEvent(entity: Entity<SpriteStateType>, event: GameEvent): void {
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
        entity: Entity<SpriteStateType>,
        event: GameEvent
    ): void {}

    private onCreate(entity: Entity<SpriteStateType>) {
        const x = -(Math.random() * 20) + 10;
        const y = -(Math.random() * 20) + 10;
        const xtex = Math.floor(Math.random() * 8) * 16;
        const crabType = Math.floor(Math.random() * 3);
        entity.setState(
            {
                toRender: {
                    position: [x, y],
                    size: [1, 1],
                    height: 0.5,
                    ...entity
                        .getServiceLocator()
                        .getResourceManager()
                        .sprite.getTextureCoordinate(
                            16,
                            16,
                            xtex,
                            64 + 16 * crabType
                        ),
                },
            },
            true
        );

        const getAnimationTexture = (xTex: number) =>
            entity
                .getServiceLocator()
                .getResourceManager()
                .sprite.getTextureCoordinate(
                    16,
                    16,
                    xTex * 16,
                    64 + 16 * crabType
                );

        this.animation = new AnimationDriver((x: number) => {
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
        })
            .tween(floorStepper(8))
            .speed(400)
            .start(Math.random(), true);
    }
}
