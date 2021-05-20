import { ServiceLocator } from "../../services/ServiceLocator";
import { ItemMetadata } from "../../engine/scripting/items/ItemTypes";
import React = require("react");
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation } from "../../util/animation/Animations";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { useServiceLocator } from "../effects/GameEffect";
import { SpriteSheets } from "../../resources/manifests";
import { Colours } from "../../resources/design/Colour";
import {
    INVENTORY_BORDER_RADIUS,
    INVENTORY_WIDTH,
} from "../containers/InventoryContainer";

const INVENTORY_ITEM_ICON_SIZE = 32;

interface InventoryItemComponentProps {
    itemMetadata: ItemMetadata;
    style: React.CSSProperties;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}

export const InventoryItemComponent: React.FunctionComponent<InventoryItemComponentProps> = (
    props
) => {
    const { itemMetadata, style } = props;
    const { item, count } = itemMetadata;

    const serviceLocator = useServiceLocator();
    const [hover, setHover] = React.useState(false);
    const [size, setSize] = React.useState(0);
    const [sizeAnimation, setSizeAnimation] = React.useState<
        GameAnimation | undefined
    >(undefined);

    const onMouseEnter = () => {
        props.onMouseEnter();
        setHover(true);
    };

    const onMouseLeave = () => {
        props.onMouseLeave();
        setHover(false);
    };

    const nameString = item.name + (count > 1 ? ` (${count})` : ``);

    return (
        <div
            style={{
                display: "flex",
                // width: INVENTORY_WIDTH,
                borderRadius: INVENTORY_BORDER_RADIUS,
                background: hover ? Colours.HOVER_GREY : Colours.DESELCT_GREY,
                paddingLeft: 8,
                ...style,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={props.onClick}
        >
            <SpriteImageComponent
                sprite={item.spriteIcon}
                spriteSheet={SpriteSheets.SPRITE}
                style={{
                    width: INVENTORY_ITEM_ICON_SIZE,
                    height: INVENTORY_ITEM_ICON_SIZE,
                }}
            />
            <TextComponent
                text={nameString}
                style={{
                    paddingLeft: 8,
                }}
                font={TextFont.REGULAR}
                size={TextSize.SMALL}
                colour={TextColour.LIGHT}
            />
        </div>
    );
};
