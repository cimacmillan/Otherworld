import { Animations } from "../../resources/ResourceManager";
import { AnimationDriver } from "../../util/animation/AnimationDriver";
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
}
