import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "./ViewportComponent";

const GAME_PANEL_RESOLUTION = 4;
const GAME_PANEL_SIZE = 16;
const BOUNDARY = 4 * GAME_PANEL_RESOLUTION;

export interface GamePanelComponentProps {
    serviceLocator: ServiceLocator;
    width: number;
    height: number;
    style: React.CSSProperties;
    childStyle: React.CSSProperties;
}

export const GamePanelComponent: React.FunctionComponent<GamePanelComponentProps> = (
    props
) => {
    const panelsWidth = Math.ceil(
        props.width / (GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION)
    );
    const panelsHeight = Math.ceil(
        props.height / (GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION)
    );
    const panelDomWidth = GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION;
    const panelDomHeight = panelDomWidth;

    const resultingWidth = panelsWidth * panelDomWidth;
    const resultingHeight = panelsHeight * panelDomHeight;

    const viewportX = BOUNDARY;
    const viewportY = BOUNDARY;
    const viewportWidth = resultingWidth - BOUNDARY * 2;
    const viewportHeight = resultingHeight - BOUNDARY * 2;

    return (
        <div
            style={{
                width: resultingWidth,
                height: resultingHeight,
                ...props.style,
            }}
        >
            <ViewportComponent
                x={viewportX}
                y={viewportY}
                width={viewportWidth}
                height={viewportHeight}
                style={props.childStyle}
            >
                {props.children}
            </ViewportComponent>
        </div>
    );
};
