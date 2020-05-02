import React = require("react");
import { TextComponent } from "./TextComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { SpriteSheets } from "../../resources/manifests/Types";
import { ViewportComponent } from "./ViewportComponent";
import { PanelImageMap } from "../../resources/Types";
import { memoize } from "lodash";

const GAME_PANEL_RESOLUTION = 4;
const GAME_PANEL_SIZE = 16;
const BOUNDARY = 4 * GAME_PANEL_RESOLUTION;

export interface GamePanelComponentProps {
    serviceLocator: ServiceLocator;
    width: number;
    height: number;
    style: React.CSSProperties;
    childStyle: React.CSSProperties;
    panelMap: PanelImageMap;
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

    const panelSprites = unMemoCreatePanelSprites(
        props.serviceLocator,
        props.panelMap,
        panelsWidth,
        panelsHeight,
        panelDomWidth,
        panelDomHeight
    );

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
            {panelSprites}
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

const unMemoCreatePanelSprites = (
    serviceLocator: ServiceLocator,
    panelMap: PanelImageMap,
    panelsWidth: number,
    panelsHeight: number,
    panelDomWidth: number,
    panelDomHeight: number
) => {
    const panelSprites: JSX.Element[] = [];
    for (let x = 0; x < panelsWidth; x++) {
        for (let y = 0; y < panelsHeight; y++) {
            panelSprites.push(
                createPanelSprite(
                    serviceLocator,
                    panelMap,
                    x,
                    y,
                    panelDomWidth,
                    panelDomHeight,
                    panelsWidth,
                    panelsHeight
                )
            );
        }
    }
    return panelSprites;
};

const createPanelSprite = (
    serviceLocator: ServiceLocator,
    panelMap: PanelImageMap,
    x: number,
    y: number,
    domWidth: number,
    domHeight: number,
    panelsWidth: number,
    panelsHeight: number
) => {
    const xTranslate = x * domWidth;
    const yTranslate = y * domHeight;
    const sprite = getPanelSprite(panelMap, x, y, panelsWidth, panelsHeight);
    return (
        <SpriteImageComponent
            key={`${x}-${y}`}
            serviceLocator={serviceLocator}
            spriteSheet={SpriteSheets.UI}
            sprite={sprite}
            style={{
                position: "absolute",
                width: domWidth,
                height: domHeight,
                transform: `translate(${xTranslate}px, ${yTranslate}px)`,
            }}
        />
    );
};

const getPanelSprite = (
    panelMap: PanelImageMap,
    x: number,
    y: number,
    width: number,
    height: number
) => {
    if (width === 1 && height === 1) {
        return panelMap.tiny;
    }

    if (width === 1) {
        console.log("Dodgy panel of width 1");
    }

    if (height === 1) {
        if (x === 0) {
            return panelMap.wideLeft;
        }

        if (x === width - 1) {
            return panelMap.wideRight;
        }

        return panelMap.wideMiddle;
    }

    let sprite = panelMap.middleMiddle;

    if (x === 0) {
        sprite = panelMap.middleLeft;
    }

    if (x === width - 1) {
        sprite = panelMap.middleRight;
    }

    if (y === 0) {
        sprite = panelMap.topMiddle;
    }

    if (y === height - 1) {
        sprite = panelMap.bottomMiddle;
    }

    if (x === 0 && y === 0) {
        sprite = panelMap.topLeft;
    }

    if (x === width - 1 && y === 0) {
        sprite = panelMap.topRight;
    }

    if (x === 0 && y === height - 1) {
        sprite = panelMap.bottomLeft;
    }

    if (x === width - 1 && y === height - 1) {
        sprite = panelMap.bottomRight;
    }

    return sprite;
};
