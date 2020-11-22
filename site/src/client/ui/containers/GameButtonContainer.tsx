import React = require("react");
import { PanelImageMap } from "../../resources/Types";
import { ServiceLocator } from "../../services/ServiceLocator";
import { GamePanelComponent } from "../components/GamePanelComponent";
import { Colours } from "../../resources/design/Colour";
import { Spacing } from "../../resources/design/Spacing";

export interface GameButtonContainerProps {
    width: number;
    height: number;
    style: React.CSSProperties;
    childStyle: React.CSSProperties;
    onSelect: () => void;
}

export interface GameButtonContainerState {
    isHovered: boolean;
    isDown: boolean;
}

export const GameButtonContainer: React.FunctionComponent<GameButtonContainerProps> = (
    props
) => {
    const [isHovered, setHovered] = React.useState(false);
    const [isDown, setDown] = React.useState(false);

    const { width, height } = props;

    const backgroundColor = isDown
        ? Colours.SELECT_WHITE
        : isHovered
        ? Colours.HOVER_GREY
        : Colours.DESELCT_GREY;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={() => setDown(true)}
            onMouseUp={() => {
                setDown(false);
                props.onSelect();
            }}
            style={{
                width,
                height,
                backgroundColor,
                borderRadius: Spacing.RADIUS_SMALL,
                ...props.childStyle,
            }}
        >
            {props.children}
        </div>
    );
};
