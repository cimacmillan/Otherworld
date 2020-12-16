import { Entity } from "../../engine/Entity";
import { SpriteRenderState } from "../../engine/state/State";
import { SpriteSheet } from "../../resources/SpriteSheet";

export const setEntityTexture = (
    entity: Entity<SpriteRenderState>,
    spritesheet: SpriteSheet,
    animation: number
) => (x: number) => {
    entity.setState(
        {
            textureCoordinate: spritesheet.getAnimationInterp(animation, x)
                .textureCoordinate,
        },
        false
    );
};
