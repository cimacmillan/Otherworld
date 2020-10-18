import {
    ItemMetadata,
    ItemCategory,
    ItemComponent,
    ItemComponentType,
    Item,
} from "../../services/scripting/items/types";
import React = require("react");
import { TextComponent, TextFont, TextColour, TextSize } from "./TextComponent";
import { Vector2D } from "../../types";
import { ShadowComponentStyle } from "./ShadowComponent";
import { animation } from "../../util/animation/Animations";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
// import { SpriteSheets, UISPRITES } from "../../resources/manifests/Types";

const TOOLTIP_WIDTH = 256;
const TOOLTIP_HEIGHT = 128;

const TOOLTIP_X_OFFSET = 64;
const TOOLTIP_Y_OFFSET = -TOOLTIP_HEIGHT / 3;

export enum TooltipType {
    NONE,
    ITEM,
}

export interface TooltipItemContext {
    type: TooltipType.ITEM;
    itemMetadata: ItemMetadata;
}

export interface TooltipNullContext {
    type: TooltipType.NONE;
}

export type TooltipContext = TooltipItemContext | TooltipNullContext;

export interface TooltipComponentProps {
    serviceLocator: ServiceLocator;
    context: TooltipContext;
    position: Vector2D;
}

export const TooltipComponent: React.FunctionComponent<TooltipComponentProps> = (
    props
) => {
    const getInnerComponent = () => {
        switch (props.context.type) {
            case TooltipType.NONE:
                return <></>;
            case TooltipType.ITEM:
                return (
                    <ItemTooltipComponent
                        serviceLocator={props.serviceLocator}
                        itemMetadata={props.context.itemMetadata}
                    />
                );
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                left: props.position.x + TOOLTIP_X_OFFSET,
                top: props.position.y + TOOLTIP_Y_OFFSET,
            }}
        >
            {getInnerComponent()}
        </div>
    );
};

interface ItemTooltipComponentProps {
    serviceLocator: ServiceLocator;
    itemMetadata: ItemMetadata;
}

export const ItemTooltipComponent: React.FunctionComponent<ItemTooltipComponentProps> = (
    props
) => {
    const [fade, setFade] = React.useState(0);

    React.useEffect(() => {
        const anim = animation(setFade).driven(false).speed(200).start();
        return () => anim.stop();
    }, []);

    const behaviours = props.itemMetadata.item.behaviours.map(
        getDescriptionFromBehaviour
    );
    const filteredBehaviours = behaviours.filter(
        (behaviour) => behaviour !== undefined
    );

    return (
        <div
            style={{
                width: TOOLTIP_WIDTH,
                ...ShadowComponentStyle(),
                opacity: fade,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TextComponent
                text={props.itemMetadata.item.name}
                font={TextFont.REGULAR}
                colour={TextColour.LIGHT}
                size={TextSize.SMALL}
                style={{
                    width: TOOLTIP_WIDTH,
                    textAlign: "center",
                }}
            />
            <TextComponent
                text={props.itemMetadata.item.category}
                font={TextFont.REGULAR}
                colour={getCategoryColour(props.itemMetadata.item.category)}
                size={TextSize.VSMALL}
                style={{}}
            />
            <TextComponent
                text={props.itemMetadata.item.description}
                font={TextFont.REGULAR}
                colour={TextColour.LIGHT}
                size={TextSize.VSMALL}
                style={{}}
            />
            <ul
                style={{
                    padding: 0,
                    margin: 0,
                    marginLeft: 16,
                    color: TextColour.LIGHT,
                }}
            >
                {filteredBehaviours.map((jsx) => (
                    <li>{jsx}</li>
                ))}
            </ul>
            {getUsingHintFromItem(
                props.serviceLocator,
                props.itemMetadata.item
            )}
        </div>
    );
};

function getCategoryColour(category: ItemCategory): TextColour {
    switch (category) {
        case ItemCategory.CONSUMABLE:
            return TextColour.RED;
        case ItemCategory.CRAFTING:
            return TextColour.YELLOW;
        case ItemCategory.PRECIOUS:
            return TextColour.GOLD;
    }
}

function getDescriptionFromBehaviour(
    behaviour: ItemComponent
): JSX.Element | undefined {
    switch (behaviour.type) {
        case ItemComponentType.HEALS_PLAYER:
            return row([
                text("Heals", TextColour.RED),
                text(`player ${behaviour.amount} pts`),
            ]);
    }
    return undefined;
}

function getUsingHintFromItem(serviceLocator: ServiceLocator, item: Item) {
    const [offset, setOffset] = React.useState(0);
    React.useEffect(() => {
        animation(setOffset).speed(500).looping().driven(false).start();
    }, []);

    const diff = 2;
    let yOffset = offset;
    yOffset = offset > 0.5 ? diff : -diff;

    switch (item.category) {
        case ItemCategory.CONSUMABLE:
            return row([
                // <SpriteImageComponent
                //     serviceLocator={serviceLocator}
                //     spriteSheet={SpriteSheets.UI}
                //     sprite={UISPRITES.ITEM_FINGER}
                //     style={{
                //         width: 32,
                //         height: 32,
                //         transform: `translate(0px, ${yOffset}px)`,
                //     }}
                // />,
                text("to consume"),
            ]);
    }
}

const row = (elements: JSX.Element[]) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            {elements}
        </div>
    );
};
const text = (text: string, colour: TextColour = TextColour.LIGHT) => {
    return (
        <TextComponent
            text={text}
            font={TextFont.REGULAR}
            colour={colour}
            size={TextSize.VSMALL}
            style={{
                marginRight: 8,
            }}
        />
    );
};
