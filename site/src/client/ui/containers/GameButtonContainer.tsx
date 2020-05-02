import React = require("react");
import { PanelImageMap } from "../../resources/Types";
import { ServiceLocator } from "../../services/ServiceLocator";
import { GamePanelComponent } from "../components/GamePanelComponent";

export interface GameButtonContainerProps {
    serviceLocator: ServiceLocator;
    width: number;
    height: number;
    style: React.CSSProperties;
    childStyle: React.CSSProperties;

    panelMapDefault: PanelImageMap;
    panelMapHover: PanelImageMap;
    panelMapPress: PanelImageMap;

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

    let panelMap = props.panelMapDefault;
    if (isHovered) {
        panelMap = props.panelMapHover;
    }
    if (isDown) {
        panelMap = props.panelMapPress;
    }

    return (
        <GamePanelComponent {...props} childStyle={{}} panelMap={panelMap}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={() => setDown(true)}
                onMouseUp={() => {
                    setDown(false);
                    props.onSelect();
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    ...props.childStyle,
                }}
            >
                {props.children}
            </div>
        </GamePanelComponent>
    );
};
