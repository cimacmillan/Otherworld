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
import { Item } from "../../types/TypesItem";
import { GameItems } from "../../resources/manifests/Items";

export interface ItemCollectionContainerProps {
    serviceLocator: ServiceLocator;
}

interface ItemListMetadata {
    item: Item;
    amount: number;
}

export const ItemCollectionContainer: React.FunctionComponent<ItemCollectionContainerProps> = (
    props
) => {
    const { serviceLocator } = props;
    const [itemList, setItemList] = React.useState([] as ItemListMetadata[]);

    React.useEffect(() => {
        setItemList([
            {
                amount: 1,
                item: GameItems.ITEM_SHELL_FRAGMENT
            },
            {
                amount: 2,
                item: GameItems.ITEM_SHELL_FRAGMENT
            },
        ]);
    }, []);

    const removeItem = (metadata: ItemListMetadata) => {
        const newList = itemList.splice(itemList.indexOf(metadata));
        setItemList(newList);
    }

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
            {
                itemList.map(itemMetadata => (
                    <ItemCollectionComponent
                        serviceLocator={serviceLocator}
                        sprite={itemMetadata.item.spriteIcon}
                        name={itemMetadata.item.name}
                        amount={itemMetadata.amount}

                        onRemove={() => removeItem(itemMetadata)}
                    />
                ))
            }
        </ViewportComponent>
    );
};
