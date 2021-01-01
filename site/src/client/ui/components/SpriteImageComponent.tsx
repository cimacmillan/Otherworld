import React = require("react");
import { getImagePropsFromSprite } from "../../util/math/UI";
import { ServiceLocator } from "../../services/ServiceLocator";
import { useServiceLocator } from "../effects/GameEffect";

export interface SpriteImageComponentProps {
    spriteSheet: string;
    sprite: string;
    style: React.CSSProperties;
}

export const SpriteImageComponent: React.FunctionComponent<SpriteImageComponentProps> = (
    props
) => {
    const serviceLocator = useServiceLocator();
    const sheet = serviceLocator.getResourceManager().manifest.spritesheets[
        props.spriteSheet
    ];
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
};
