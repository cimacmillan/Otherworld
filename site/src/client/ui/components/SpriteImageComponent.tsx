import React = require("react");
import { getImagePropsFromSprite } from "../../util/math/UI";
import { ServiceLocator } from "../../services/ServiceLocator";

export interface SpriteImageComponentProps {
    serviceLocator: ServiceLocator;
    spriteSheet: number;
    sprite: number;
    style: React.CSSProperties;
}

export function SpriteImageComponent(props: SpriteImageComponentProps) {
    const sheet = props.serviceLocator.getResourceManager().manifest
        .spritesheets[props.spriteSheet];
    return (
        <div
            style={{
                ...getImagePropsFromSprite(
                    sheet.getSprite(props.sprite),
                    props.style.width as number,
                    props.style.height as number
                ),
                ...props.style,
            }}
        />
    );
}