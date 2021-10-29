import {
    ItemMetadata,
    ItemType,
    Item,
} from "../../engine/scripting/items/ItemTypes";
import React = require("react");
import { TextComponent, TextFont, TextColour, TextSize } from "./TextComponent";
import { Vector2D } from "../../types";
import { ShadowComponentStyle } from "./ShadowComponent";
import { animation } from "../../util/animation/Animations";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { SpriteSheets } from "../../resources/manifests";
import { EffectComponent } from "./EffectComponent";
import { Effect } from "../../engine/scripting/effects/Effects";
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
    item: Item;
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
                        item={props.context.item}
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
    item: Item;
}

export const ItemTooltipComponent: React.FunctionComponent<ItemTooltipComponentProps> = (
    props
) => {
    const [fade, setFade] = React.useState(0);

    React.useEffect(() => {
        const anim = animation(setFade).driven(false).speed(200).start();
        return () => anim.stop();
    }, []);

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
                text={props.item.name}
                font={TextFont.REGULAR}
                colour={TextColour.LIGHT}
                size={TextSize.SMALL}
                style={{
                    width: TOOLTIP_WIDTH,
                    textAlign: "center",
                }}
            />
            <TextComponent
                text={props.item.type}
                font={TextFont.REGULAR}
                colour={getCategoryColour(props.item.type)}
                size={TextSize.VSMALL}
                style={{}}
            />
            <TextComponent
                text={props.item.description}
                font={TextFont.REGULAR}
                colour={TextColour.LIGHT}
                size={TextSize.VSMALL}
                style={{}}
            />
            {getEffectHintsFromItem(props.item)}
            {getUsingHintFromItem(
                props.serviceLocator,
                props.item
            )}
        </div>
    );
};

function getCategoryColour(category: ItemType): TextColour {
    switch (category) {
        case ItemType.CONSUMABLE:
            return TextColour.RED;
        case ItemType.CRAFTING:
            return TextColour.YELLOW;
        case ItemType.PRECIOUS:
            return TextColour.GOLD;
        case ItemType.KEY:
            return TextColour.GOLD;
        case ItemType.EQUIPMENT:
            return TextColour.STEEL;
    }
}

function getUsingHintFromItem(serviceLocator: ServiceLocator, item: Item) {
    const [offset, setOffset] = React.useState(0);
    React.useEffect(() => {
        animation(setOffset).speed(500).looping().driven(false).start();
    }, []);

    const diff = 2;
    let yOffset = offset;
    yOffset = offset > 0.5 ? diff : -diff;

    switch (item.type) {
        case ItemType.EQUIPMENT:
            const isEquipped = serviceLocator.getScriptingService().getPlayer().getInventory().equipped[item.equipmentType] === item;
            return row([
                <SpriteImageComponent
                    spriteSheet={SpriteSheets.SPRITE}
                    sprite={"ui_finger"}
                    style={{
                        width: 32,
                        height: 32,
                        transform: `translate(0px, ${yOffset}px)`,
                    }}
                />,
                isEquipped ? text("to unequip") : text("to equip"),
            ]);
        case ItemType.CONSUMABLE:
                return row([
                    <SpriteImageComponent
                        spriteSheet={SpriteSheets.SPRITE}
                        sprite={"ui_finger"}
                        style={{
                            width: 32,
                            height: 32,
                            transform: `translate(0px, ${yOffset}px)`,
                        }}
                    />,
                    text("to consume"),
                ]);
    }
}

function getEffectHintsFromItem(item: Item): JSX.Element {
    const effectList = (effects: Effect[]) => (
        <ul
            style={{
                padding: 0,
                margin: 0,
                marginLeft: 16,
                color: TextColour.LIGHT,
            }}
        >
            {effects.map(effect => <EffectComponent effect={effect}/>)}
        </ul>
    )

    switch (item.type) {
        case ItemType.EQUIPMENT: 
            return (
                <>
                {item.onAttack && (
                    <>
                    {text("On attack", TextColour.GOLD)}
                    {effectList(item.onAttack)}
                    </>
                )}
                {item.onEquip && (
                    <>
                    {text("On equip", TextColour.GOLD)}
                    {effectList(item.onEquip)}
                    </>
                )}                
                </>
        )
        case ItemType.CONSUMABLE:
            return (
                <>
                {item.onConsume && (
                    <>
                    {text("On consume", TextColour.GOLD)}
                    {effectList(item.onConsume)}
                    </>
                )}
                </>
            )
    }
    return undefined;
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
