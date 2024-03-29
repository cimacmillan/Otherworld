import { ViewportComponent } from "../components/ViewportComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import {
    ShadowComponentStyle,
    ShadowComponentStyleSmall,
} from "../components/ShadowComponent";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { ItemCollectionComponent } from "../components/ItemCollectionComponent";
import { Item } from "../../engine/scripting/items/ItemTypes";
import { GameItems } from "../../resources/manifests/Items";
import { useDispatchListener, useGlobalState } from "../effects/GlobalState";
import { Actions } from "../../Actions";
import { useServiceLocator } from "../effects/GameEffect";

export interface ItemCollectionContainerProps {}

interface ItemListMetadata {
    key: number;
    item: Item;
    amount: number;
}

let key = 0;
const keyLimit = 10000;

export const ItemCollectionContainer: React.FunctionComponent<ItemCollectionContainerProps> = (
    props
) => {
    const serviceLocator = useServiceLocator();
    const [itemList, setItemList] = React.useState([] as ItemListMetadata[]);

    const addItem = (item: Item) => {
        if (item.stackable) {
            const itemInList = itemList.find(
                (itemInList) =>
                    itemInList.item.stackable && itemInList.item.id === item.id
            );
            if (itemInList) {
                itemInList.amount++;
                setItemList([...itemList]);
                return;
            }
        }
        setItemList([
            ...itemList,
            {
                key: key,
                amount: 1,
                item: item,
            },
        ]);
        key++;
        key = key % keyLimit;
    };

    const removeItem = (metadata: ItemListMetadata) => {
        const removeElement = itemList.indexOf(metadata); // remove number 3
        var newList = [
            ...itemList.slice(0, removeElement),
            ...itemList.slice(removeElement + 1),
        ];
        setItemList(newList);
    };

    useDispatchListener({
        onPlayerItemDropCollected: (item: Item) => {
            addItem(item);
        }
    }, [itemList]);
    
    return (
        <ViewportComponent
            x={0}
            y={0}
            width={DOM_WIDTH}
            height={DOM_HEIGHT}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
        >
            {itemList.map((itemMetadata) => {
                return <ItemCollectionComponent
                    key={itemMetadata.key}
                    serviceLocator={serviceLocator}
                    sprite={itemMetadata.item.spriteIcon}
                    name={itemMetadata.item.name}
                    amount={itemMetadata.amount}
                    onRemove={() => removeItem(itemMetadata)}
                />
            })}
        </ViewportComponent>
    );
};
