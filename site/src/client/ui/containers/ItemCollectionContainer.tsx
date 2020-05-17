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
import { ItemCollectionComponent } from "../components/ItemCollectionComponent";

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
            <ItemCollectionComponent
                serviceLocator={serviceLocator}
                sprite={Sprites.ITEM_SHELL_FRAGMENT}
                name={"Shell fragment"}
                amount={2}
            />
            <ItemCollectionComponent
                serviceLocator={serviceLocator}
                sprite={Sprites.ITEM_SHELL_FRAGMENT}
                name={"Another Shell fragment"}
                amount={2}
            />
        </ViewportComponent>
    );
};
