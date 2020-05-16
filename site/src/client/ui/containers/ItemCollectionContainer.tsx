import { ViewportComponent } from "../components/ViewportComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import React = require("react");
import { GamePanelComponent } from "../components/GamePanelComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { DARK_PANEL } from "../../resources/manifests/DarkPanel";
import {
    ShadowComponentStyle,
    ShadowComponentStyleSmall,
} from "../components/ShadowComponent";
import { SpriteSheets, Sprites } from "../../resources/manifests/Types";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";

export interface ItemCollectionContainerProps {
    serviceLocator: ServiceLocator;
}

export const ItemCollectionContainer: React.FunctionComponent<ItemCollectionContainerProps> = (
    props
) => {
    const { serviceLocator } = props;

    return (
        <ViewportComponent
            x={0}
            y={0}
            width={DOM_WIDTH}
            height={DOM_HEIGHT}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: 16,
                        ...ShadowComponentStyle(),
                    }}
                >
                    <TextComponent
                        text={"x1"}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                        style={{}}
                    />
                    <SpriteImageComponent
                        serviceLocator={props.serviceLocator}
                        spriteSheet={SpriteSheets.SPRITE}
                        sprite={Sprites.ITEM_SHELL_FRAGMENT}
                        style={{
                            width: 32,
                            height: 32,
                            marginRight: 4,
                            marginLeft: 4,
                        }}
                    />
                    <TextComponent
                        text={"Shell fragment"}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                        style={{}}
                    />
                </div>
            </div>
        </ViewportComponent>
    );
};
