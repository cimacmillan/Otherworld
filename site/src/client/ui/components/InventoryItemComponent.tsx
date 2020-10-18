import { ServiceLocator } from "../../services/ServiceLocator";
import { ItemMetadata } from "../../services/scripting/items/types";
import React = require("react");
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation } from "../../util/animation/Animations";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";

const INVENTORY_ITEM_SIZE = 48;
const INVENTORY_PANEL_SIZE = 64;
const INVENTORY_ITEM_SIZE_INCREASE = 8;
const INVENTORY_ITEM_SIZE_SPEED = 200;

interface InventoryItemComponentProps {
    serviceLocator: ServiceLocator;
    itemMetadata: ItemMetadata;
    style: React.CSSProperties;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}

export const InventoryItemComponent: React.FunctionComponent<InventoryItemComponentProps> = (
    props
) => {
    const { serviceLocator, itemMetadata, style } = props;
    const { item, count } = itemMetadata;

    const [hover, setHover] = React.useState(false);
    const [size, setSize] = React.useState(0);
    const [sizeAnimation, setSizeAnimation] = React.useState<
        GameAnimation | undefined
    >(undefined);

    const onMouseEnter = () => {
        setHover(true);
        if (sizeAnimation) {
            sizeAnimation.stop();
        }
        const anim = animation(setSize)
            .driven(false)
            .speed(INVENTORY_ITEM_SIZE_SPEED)
            .start();
        setSizeAnimation(anim);
        props.onMouseEnter();
    };
    const onMouseLeave = () => {
        setHover(false);
        if (sizeAnimation) {
            sizeAnimation.stop();
        }
        const anim = animation((x) => setSize(1 - x))
            .driven(false)
            .speed(INVENTORY_ITEM_SIZE_SPEED)
            .start();
        setSizeAnimation(anim);
        props.onMouseLeave();
    };

    const sizeOffset = size * INVENTORY_ITEM_SIZE_INCREASE;
    const numberOffset = INVENTORY_PANEL_SIZE / 8;

    return (
        <div
            style={{
                width: INVENTORY_PANEL_SIZE,
                height: INVENTORY_PANEL_SIZE,
                ...style,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={props.onClick}
        >
            <div
                style={{
                    position: "absolute",
                    width: INVENTORY_PANEL_SIZE,
                    height: INVENTORY_PANEL_SIZE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* <SpriteImageComponent
                    serviceLocator={serviceLocator}
                    sprite={
                        hover
                            ? UISPRITES.ITEM_PANEL_HOVER
                            : UISPRITES.ITEM_PANEL
                    }
                    spriteSheet={SpriteSheets.UI}
                    style={{
                        position: "absolute",
                        width: INVENTORY_PANEL_SIZE,
                        height: INVENTORY_PANEL_SIZE,
                    }}
                />
                <SpriteImageComponent
                    serviceLocator={serviceLocator}
                    sprite={item.spriteIcon}
                    spriteSheet={SpriteSheets.SPRITE}
                    style={{
                        position: "absolute",
                        width: INVENTORY_ITEM_SIZE + sizeOffset,
                        height: INVENTORY_ITEM_SIZE + sizeOffset,
                    }}
                /> */}
            </div>
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    width: INVENTORY_PANEL_SIZE,
                    height: INVENTORY_PANEL_SIZE,
                    pointerEvents: "none",
                }}
            >
                <TextComponent
                    text={`${count}`}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                    style={{
                        transform: `translate(${numberOffset}px, ${numberOffset}px)`,
                    }}
                />
            </div>
        </div>
    );
};
