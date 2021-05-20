import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { getImagePropsFromSprite } from "../../util/math/UI";

export interface AnimationImageComponentProps {
    serviceLocator: ServiceLocator;
    spriteSheet: number;
    animation: string;
    style: React.CSSProperties;
    interp: number;
}

export const AnimationImageComponent: React.FunctionComponent<AnimationImageComponentProps> = (
    props: AnimationImageComponentProps
) => {
    const sheet = props.serviceLocator.getResourceManager().manifest
        .spritesheets[props.spriteSheet];
    return (
        <div
            style={{
                ...getImagePropsFromSprite(
                    sheet.getAnimationInterp(props.animation, props.interp),
                    props.style.width as number,
                    props.style.height as number
                ),
                ...props.style,
            }}
        />
    );
};
