import {
    SpriteRenderComponent,
    SpriteStateType,
} from "../../../engine/components/rendering/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { Sprites, SpriteSheets } from "../../../resources/manifests/Types";
import { ServiceLocator } from "../../ServiceLocator";

export function createMerchant(
    serviceLocator: ServiceLocator,
    x: number,
    y: number
) {
    const DEFAULT_HEIGHT = 1;

    const spritesheet = serviceLocator.getResourceManager().manifest
        .spritesheets[SpriteSheets.SPRITE];

    const initialState: SpriteStateType = {
        exists: false,
        position: { x, y },
        height: DEFAULT_HEIGHT,
        radius: 0.5,
        angle: 0,
        shouldRender: true,
        textureCoordinate: spritesheet.getSprite(Sprites.MERCHANT)
            .textureCoordinate,
        spriteWidth: 1,
        spriteHeight: 2,
    };

    return new Entity<SpriteStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent()
    );
}
