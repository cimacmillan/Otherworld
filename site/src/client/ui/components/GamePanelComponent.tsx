import React = require("react");
import { TextComponent } from "./Text";
import { ServiceLocator } from "../../services/ServiceLocator";
import { SpriteImageComponent } from "./SpriteImageComponent";
import {
    SpriteSheets,
    UISPRITES,
} from "../../services/resources/manifests/DefaultManifest";
import { Sprite } from "../../services/resources/SpriteSheet";
import { Viewport } from "./Viewport";

const GAME_PANEL_RESOLUTION = 4;
const GAME_PANEL_SIZE = 16;
const BOUNDARY = 4 * GAME_PANEL_RESOLUTION;

export interface GamePanelComponentProps {
    serviceLocator: ServiceLocator;
    width: number;
    height: number;
    x: number;
    y: number;
    style: React.CSSProperties;
}

export class GamePanelComponent extends React.PureComponent<
    GamePanelComponentProps
> {
    constructor(props: GamePanelComponentProps) {
        super(props);
    }

    public render() {
        const panelsWidth = Math.ceil(
            this.props.width / (GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION)
        );
        const panelsHeight = Math.ceil(
            this.props.height / (GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION)
        );
        const panelDomWidth = GAME_PANEL_SIZE * GAME_PANEL_RESOLUTION;
        const panelDomHeight = panelDomWidth;

        const resultingWidth = panelsWidth * panelDomWidth;
        const resultingHeight = panelsHeight * panelDomHeight;

        const panelSprites: JSX.Element[] = [];
        for (let x = 0; x < panelsWidth; x++) {
            for (let y = 0; y < panelsHeight; y++) {
                panelSprites.push(
                    this.createPanelSprite(
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

        const viewportX = BOUNDARY;
        const viewportY = BOUNDARY;
        const viewportWidth = resultingWidth - BOUNDARY * 2;
        const viewportHeight = resultingHeight - BOUNDARY * 2;

        return (
            <div
                style={{
                    marginLeft: this.props.x,
                    marginTop: this.props.y,
                    width: resultingWidth,
                    height: resultingHeight,
                    ...this.props.style,
                }}
            >
                {panelSprites}
                <Viewport
                    x={viewportX}
                    y={viewportY}
                    width={viewportWidth}
                    height={viewportHeight}
                >
                    {this.props.children}
                </Viewport>
            </div>
        );
    }

    private createPanelSprite(
        x: number,
        y: number,
        domWidth: number,
        domHeight: number,
        panelsWidth: number,
        panelsHeight: number
    ) {
        const xTranslate = x * domWidth;
        const yTranslate = y * domHeight;
        const sprite = this.getPanelSprite(x, y, panelsWidth, panelsHeight);
        return (
            <SpriteImageComponent
                serviceLocator={this.props.serviceLocator}
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
    }

    private getPanelSprite(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        if (width === 1 && height === 1) {
            return UISPRITES.PANEL_SS;
        }

        if (width === 1) {
            console.log("Dodgy panel of width 1");
        }

        if (height === 1) {
            if (x === 0) {
                return UISPRITES.PANEL_SL;
            }

            if (x === width - 1) {
                return UISPRITES.PANEL_SR;
            }

            return UISPRITES.PANEL_SM;
        }

        let sprite = UISPRITES.PANEL_CENTER;

        if (x === 0) {
            sprite = UISPRITES.PANEL_ML;
        }

        if (x === width - 1) {
            sprite = UISPRITES.PANEL_MR;
        }

        if (y === 0) {
            sprite = UISPRITES.PANEL_TM;
        }

        if (y === height - 1) {
            sprite = UISPRITES.PANEL_BM;
        }

        if (x === 0 && y === 0) {
            sprite = UISPRITES.PANEL_TL;
        }

        if (x === width - 1 && y === 0) {
            sprite = UISPRITES.PANEL_TR;
        }

        if (x === 0 && y === height - 1) {
            sprite = UISPRITES.PANEL_BL;
        }

        if (x === width - 1 && y === height - 1) {
            sprite = UISPRITES.PANEL_BR;
        }

        return sprite;
    }
}
