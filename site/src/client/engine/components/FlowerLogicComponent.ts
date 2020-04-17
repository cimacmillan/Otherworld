import { SpriteSheets } from "../../services/resources/manifests/DefaultManifest";
import { GameAnimation } from "../../util/animation/Animation";
import { floorStepper } from "../../util/animation/TweenFunction";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { EntityEventType } from "../events/EntityEvents";
import { GameEvent } from "../events/Event";
import { SpriteStateType } from "./SpriteRenderComponent";

export class FlowerLogicComponent<
    T extends SpriteStateType
> extends EntityComponent<T> {
    private seed: number;
    private animation: GameAnimation;

    public init(entity: Entity<SpriteStateType>) {
        this.seed = Math.random();
        return {};
    }

    public update(entity: Entity<SpriteStateType>): void {
        if (this.animation) {
            this.animation.tick();
        }
        if (this.animation.getPlayCount() > 5) {
            this.animation.stop();
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
        const xtex = Math.floor(Math.random() * 16) * 32;
        entity.setState(
            {
                toRender: {
                    position: [x, y],
                    size: [2, 2],
                    height: 1,
                    ...entity
                        .getServiceLocator()
                        .getResourceManager()
                        .manifest.spritesheets[
                            SpriteSheets.SPRITE
                        ].getTextureCoordinate(32, 32, xtex, 0),
                },
            },
            true
        );

        const getAnimationTexture = (xTex: number) =>
            entity
                .getServiceLocator()
                .getResourceManager()
                .manifest.spritesheets[
                    SpriteSheets.SPRITE
                ].getTextureCoordinate(32, 32, xTex * 32, 0);

        this.animation = new GameAnimation((x: number) => {
            const toRender = entity.getState().toRender;
            const texture = getAnimationTexture(x);
            toRender.textureX = texture.textureX;
            toRender.textureY = texture.textureY;
        })
            .tween(floorStepper(16))
            .speed(2000)
            .start({
                offset: Math.random(),
                loop: true,
            });
    }
}
