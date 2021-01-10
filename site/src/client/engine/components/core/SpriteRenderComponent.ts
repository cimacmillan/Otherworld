import { SpriteSheets } from "../../../resources/manifests/Sprites";
import {
    RenderItem,
    Sprite,
    SpriteShadeOverride,
} from "../../../services/render/types/RenderInterface";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    DEFAULT_SPRITE_RENDER_STATE,
    SpriteRenderState,
} from "../../state/State";

const DEFAULT_SHADE_OVERRIDE: SpriteShadeOverride = {
    r: 0,
    g: 0,
    b: 0,
    intensity: 0,
};

function getSpriteFromState(entity: Entity<SpriteRenderState>): Sprite {
    const {
        position,
        sprite,
        spriteWidth,
        spriteHeight,
        height,
        shade,
    } = entity.getState();
    return {
        position: [position.x, position.y],
        size: [spriteWidth, spriteHeight],
        height: height + spriteHeight / 2,
        texture: entity
            .getServiceLocator()
            .getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(sprite)
            .textureCoordinate,
        shade: shade || DEFAULT_SHADE_OVERRIDE,
    };
}

export const SpriteRenderComponent = (): EntityComponent<SpriteRenderState> => {
    let toRenderRef: RenderItem;

    return {
        getInitialState: () => DEFAULT_SPRITE_RENDER_STATE,
        onCreate: (entity: Entity<SpriteRenderState>) => {
            toRenderRef = entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.createItem(getSpriteFromState(entity));
        },
        update: (entity: Entity<SpriteRenderState>) => {
            const sprite = getSpriteFromState(entity);
            entity
                .getServiceLocator()
                .getRenderService()
                .spriteRenderService.updateItem(toRenderRef, sprite);
        },
        onDestroy: (entity: Entity<SpriteRenderState>) => {
            if (toRenderRef) {
                entity
                    .getServiceLocator()
                    .getRenderService()
                    .spriteRenderService.freeItem(toRenderRef);
                toRenderRef = undefined;
            }
        },
    };
};
