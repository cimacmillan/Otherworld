import { Sprites } from "../../../resources/manifests/Sprites";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { animation } from "../../../util/animation/Animations";
import {
    PhysicsComponent,
    PhysicsState,
} from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

export type SlimeState = SpriteRenderState & PhysicsState;

const SpriteSizeWobbles = (wobble: number, wobbleSpeed: number) => {
    const func = (entity: Entity<SpriteRenderState>) => {
        const { spriteWidth, spriteHeight } = entity.getState();
        return animation((x: number) => {
            const sin = Math.sin(x * Math.PI * 2) * wobble;
            entity.setState({
                spriteWidth: spriteWidth + sin,
                spriteHeight: spriteHeight - sin,
            });
        })
            .looping()
            .speed(wobbleSpeed);
    };
    return AnimationComponent<SpriteRenderState>(func);
};

export function createSlime(
    serviceLocator: ServiceLocator,
    state: SlimeState
): Entity<SlimeState> {
    return new Entity<SlimeState>(
        undefined,
        serviceLocator,
        state,
        SpriteRenderComponent(),
        PhysicsComponent(),
        SpriteSizeWobbles(0.1, 500)
    );
}

export function getSlimeState(
    serviceLocator: ServiceLocator,
    x: number,
    y: number
): SlimeState {
    return {
        sprite: Sprites.SLIME,
        spriteWidth: 1,
        spriteHeight: 1,
        position: { x, y },
        height: 1,
        heightVelocity: 0,
        yOffset: 0,
        radius: 0.5,
        angle: 0,
        velocity: { x: 0, y: 0 },
        friction: 0.9,
        mass: 1,
        elastic: 0.8,
        collidesEntities: true,
        collidesWalls: true,
        shade: {
            r: 1,
            g: 1,
            b: 1,
            intensity: 0.1,
        },
    };
}
