import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { Colours } from "../../resources/design/Colour";
import { Spacing } from "../../resources/design/Spacing";
import { useServiceLocator } from "../effects/GameEffect";
import { Audios } from "../../resources/manifests/Audios";

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
    const serviceLocator = useServiceLocator();

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
                serviceLocator
                    .getAudioService()
                    .play(
                        serviceLocator.getResourceManager().manifest.audio[
                            Audios.BUTTON_PRESS
                        ],
                        0.4
                    );
            }}
            style={{
                width,
                height,
                backgroundColor,
                borderRadius: Spacing.RADIUS_SMALL,
                cursor: "pointer",
                ...props.childStyle,
            }}
        >
            {props.children}
        </div>
    );
};
