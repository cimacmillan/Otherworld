import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { SpriteSheets, UISPRITES } from "../../resources/manifests/Types";

interface KeyComponentProps {
    serviceLocator: ServiceLocator;
    keyCode: string;
    selected: boolean;
    style: React.CSSProperties;
}

const KEY_WIDTH = 64;
const KEY_HEIGHT = 64;
export const SELECTED_TEXT_OFFSET = 4;

export const KeyComponent: React.FunctionComponent<KeyComponentProps> = (
    props
) => {
    const sprite = props.selected ? UISPRITES.KEY_DOWN : UISPRITES.KEY_UP;
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;

    return (
        <div
            style={{
                ...props.style,
                width: KEY_WIDTH,
                height: KEY_HEIGHT,
            }}
        >
            <SpriteImageComponent
                serviceLocator={props.serviceLocator}
                spriteSheet={SpriteSheets.UI}
                sprite={sprite}
                style={{
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                }}
            />
            <TextComponent
                text={props.keyCode}
                font={TextFont.REGULAR}
                size={TextSize.MED}
                colour={TextColour.LIGHT}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                    transform: `translate(0px, ${offset}px)`,
                }}
            />
        </div>
    );
};
