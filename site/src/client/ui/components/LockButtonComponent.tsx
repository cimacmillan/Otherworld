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

interface LockButtonComponentProps {
    selected: boolean;
    onPress: () => void;
    style: React.CSSProperties;
    colourPrimary: string;
    colourSecondary: string;
}

const KEY_CONTAINER_WIDTH = 64;
const KEY_CONTAINER_HEIGHT = 64;
const KEY_WIDTH = 48;
const KEY_HEIGHT = 48;
export const SELECTED_TEXT_OFFSET = 8;
export const HOVER_TEXT_OFFSET = 12;

export const LockButtonComponent: React.FunctionComponent<LockButtonComponentProps> = (
    props
) => {
    const [hover, setHovered] = React.useState(false);

    const offset = props.selected
        ? 0
        : hover
        ? HOVER_TEXT_OFFSET
        : SELECTED_TEXT_OFFSET;

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
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={props.onPress}
        >
            <div
                style={{
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                    backgroundColor: props.colourSecondary,
                    // transform: `translate(0px, ${offset}px)`,
                    borderRadius: Spacing.RADIUS_SMALL,
                    // marginTop: offset,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: KEY_WIDTH,
                    height: KEY_HEIGHT,
                    backgroundColor: props.colourPrimary,
                    transform: `translate(0px, ${-offset}px)`,
                    borderRadius: Spacing.RADIUS_SMALL,
                }}
            />
        </div>
    );
};
