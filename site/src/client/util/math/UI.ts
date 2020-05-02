import { CSSProperties } from "react";
import { Sprite } from "../../resources/SpriteSheet";

export function getImagePropsFromSprite(
    sprite: Sprite,
    domWidth: number,
    domHeight: number
): Partial<CSSProperties> {
    const spriteWidth = sprite.pixelCoordinate.textureWidth;
    const spriteHeight = sprite.pixelCoordinate.textureHeight;
    const spritePosX = sprite.pixelCoordinate.textureX;
    const spritePosY = sprite.pixelCoordinate.textureY;

    const spriteSheetWidth = sprite.spriteSheetWidth;
    const spriteSheetHeight = sprite.spriteSheetHeight;

    const scalarWidth = domWidth / spriteWidth;
    const scalarHeight = domHeight / spriteHeight;

    const backgroundWidth = Math.ceil(spriteSheetWidth * scalarWidth);
    const backgroundHeight = Math.ceil(spriteSheetHeight * scalarHeight);

    const backgroundPositionX = Math.ceil(spritePosX * scalarWidth);
    const backgroundPositionY = Math.ceil(spritePosY * scalarHeight);

    return {
        backgroundImage: `url(${sprite.source})`,
        backgroundPosition: `-${backgroundPositionX}px -${backgroundPositionY}px`,
        backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`,
        imageRendering: "pixelated",
    };
}
