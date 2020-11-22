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

export function getHexFromRGB(r: number, g: number, b: number) {
    return `${getHexFromByte(r)}${getHexFromByte(g)}${getHexFromByte(b)}`;
}

export function getHexFromByte(r: number) {
    const upper = (r >> 4) & 15;
    const lower = r & 15;

    return `${getHexFrom4Bit(upper)}${getHexFrom4Bit(lower)}`;
}

export function getHexFrom4Bit(r: number) {
    if (r < 9) {
        return r;
    }
    switch (r) {
        case 10:
            return "a";
        case 11:
            return "b";
        case 12:
            return "c";
        case 13:
            return "d";
        case 14:
            return "e";
        case 15:
            return "f";
    }

    return "?";
}
