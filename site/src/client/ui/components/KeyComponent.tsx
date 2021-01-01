import React = require("react");
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
    TextShadow,
} from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Colours } from "../../resources/design/Colour";
import { Spacing } from "../../resources/design/Spacing";

interface KeyComponentProps {
    keyCode: string;
    selected: boolean;
    style: React.CSSProperties;
}

const KEY_CONTAINER_WIDTH = 56;
const KEY_CONTAINER_HEIGHT = 56;
const KEY_WIDTH = 48;
const KEY_HEIGHT = 48;
export const SELECTED_TEXT_OFFSET = 4;

export const KeyComponent: React.FunctionComponent<KeyComponentProps> = (
    props
) => {
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;

    return (
        <div
            style={{
                ...props.style,
                width: KEY_CONTAINER_WIDTH,
                height: KEY_CONTAINER_HEIGHT,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                    backgroundColor: Colours.DESELCT_GREY,
                    transform: `translate(0px, ${offset}px)`,
                    borderRadius: Spacing.RADIUS_SMALL,
                    marginTop: props.selected ? 0 : 8,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                    backgroundColor: Colours.HOVER_GREY,
                    transform: `translate(0px, ${offset}px)`,
                    borderRadius: Spacing.RADIUS_SMALL,
                }}
            />
            <TextComponent
                text={props.keyCode}
                font={TextFont.REGULAR}
                size={TextSize.MED}
                colour={TextColour.LIGHT}
                // shadow={TextShadow.LARGE}
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
