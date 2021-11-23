import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "../components/ViewportComponent";
import useBoundingclientrect from "@rooks/use-boundingclientrect";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { animation } from "../../util/animation/Animations";
import {
    TextComponent,
    TextColour,
    TextSize,
    TextFont,
} from "../components/TextComponent";
import { useDispatchListener, useGlobalState } from "../effects/GlobalState";
import { Actions } from "../../Actions";
import { ShadowComponentStyle } from "../components/ShadowComponent";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import { EquipableItem, EquipmentType, getEmptyInventory, Inventory, Item, ItemMetadata } from "../../engine/scripting/items/ItemTypes";
import { GameItems } from "../../resources/manifests/Items";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { chunk } from "lodash";
import { InventoryItemComponent } from "../components/InventoryItemComponent";
import { TooltipComponent, TooltipType } from "../components/TooltipComponent";
import { Vector2D } from "../../types";
import { useServiceLocator } from "../effects/GameEffect";
import { Colours } from "../../resources/design/Colour";
import { PlayerUseItemFromInventory, UnequipItemFromInventory } from "../../engine/commands/InventoryCommands";
import { SpriteSheets } from "../../resources/manifests";
import { Effect } from "../../engine/scripting/effects/Effects";
import { EffectComponent } from "../components/EffectComponent";

const FADE_IN = 200;
export const INVENTORY_WIDTH = 520;
export const INVENTORY_HEIGHT = 312;
export const INVENTORY_BORDER_RADIUS = 8;

export interface InventoryContainerProps {}

enum InventoryTabs {
    Inventory = "Inventory",
    Equipment = "Equipment"
}

const inventoryTabs = [
    InventoryTabs.Inventory,
    InventoryTabs.Equipment
]

export const InventoryContainer: React.FunctionComponent<InventoryContainerProps> = (
    props
) => {
    const myRef = React.useRef();
    const getBoundingClientRect = useBoundingclientrect(myRef);
    const serviceLocator = useServiceLocator();
    const [inventoryShowing, setInventoryShowing] = React.useState(false);
    const [tooltipItem, setTooltipItem] = React.useState<
        Item | undefined
    >(undefined);
    const [fade, setFade] = React.useState(0);
    const [mousePosition, setMousePosition] = React.useState<Vector2D>({
        x: 0,
        y: 0,
    });
    const [inventory, setInventory] = React.useState<Inventory>(getEmptyInventory());
    const [state, dispatch] = useGlobalState();
    const [activeTab, setActiveTab] = React.useState<InventoryTabs>(InventoryTabs.Inventory);

    React.useEffect(() => {
        setInventory(serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory());
    });

    React.useEffect(() => {
        if (state.inventory.showing) {
            setInventoryShowing(true);
            animation(setFade).speed(FADE_IN).driven(false).start();
        } else {
            animation((x) => setFade(1 - x))
                .speed(FADE_IN)
                .driven(false)
                .start()
                .whenDone(() => {
                    setInventoryShowing(false);
                    setTooltipItem(undefined);
                });
        }
    }, [state.inventory.showing]);

    const onSetItemTooltip = (item: Item | undefined) => {
        setTooltipItem(item);
    };

    const onItemUsed = (itemMetadata: ItemMetadata | undefined) => {
        if (itemMetadata.count === 0) {
            return;
        }
        const { item, count } = itemMetadata;
        const itemAmount = serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory().items.length;
        PlayerUseItemFromInventory(serviceLocator)(item);
        setInventory(serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory());
        if (inventory.items.length !== itemAmount) {
            onSetItemTooltip(undefined);
        }
    };

    const onItemUnequiped = (item: EquipableItem) => {
        UnequipItemFromInventory(serviceLocator, item);
        setInventory(serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory());
        onSetItemTooltip(undefined);
    }

    return (
        <div
            ref={myRef}
            style={{
                position: "absolute",
                width: DOM_WIDTH,
                height: DOM_HEIGHT,
            }}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
                setMousePosition({
                    x: e.pageX - getBoundingClientRect.left,
                    y: e.pageY - getBoundingClientRect.top,
                })
            }
        >
            <ViewportComponent
                x={0}
                y={0}
                width={DOM_WIDTH}
                height={DOM_HEIGHT}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {inventoryShowing && (
                    <div
                        style={{
                            opacity: fade,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            ...ShadowComponentStyle(),
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            {
                                inventoryTabs.map(tab => (
                                    <InventoryTab label={tab} open={tab === activeTab} onPress={() => setActiveTab(tab)}/>
                                ))
                            }
                        </div>

                        <div
                            style={{
                                width: INVENTORY_WIDTH,
                                height: INVENTORY_HEIGHT,
                                background: Colours.DESELCT_GREY,
                                borderRadius: `0px ${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px`,
                            }}
                        >
                            {
                                (() => {
                                    switch (activeTab) {
                                        case InventoryTabs.Inventory:
                                            return <InventoryItems
                                                items={inventory.items}
                                                onMouseEnter={(item) => onSetItemTooltip(item.item)}
                                                onMouseLeave={(item) =>
                                                    onSetItemTooltip(undefined)
                                                }
                                                onClick={(item) => onItemUsed(item)}
                                            />
                                        case InventoryTabs.Equipment:
                                            return <InventoryEquipment
                                                inventory={inventory}
                                                onMouseEnter={(item) => onSetItemTooltip(item)}
                                                onMouseLeave={(item) =>
                                                    onSetItemTooltip(undefined)
                                                }
                                                onMousePress={(item) => onItemUnequiped(item)}
                                            />
                                    }
                                })()
                            }
                        </div>
                    </div>
                )}
                {tooltipItem && inventoryShowing && (
                    <div style={{opacity: fade}}>
                        <TooltipComponent
                            serviceLocator={serviceLocator}
                            context={{
                                type: TooltipType.ITEM,
                                item: tooltipItem,
                            }}
                            position={mousePosition}
                        />
                    </div>
                )}
            </ViewportComponent>
        </div>
    );
};

const InventoryTab: React.FunctionComponent<{
    label: string,
    open: boolean,
    onPress: () => void
}> = (props) => {
    const { label, open, onPress } = props;
    return <TextComponent
        text={label}
        size={TextSize.SMALL}
        colour={open ? TextColour.LIGHT : TextColour.LESS_LIGHT}
        style={{
            paddingLeft: 8,
            paddingRight: 8,
            background: open ? Colours.DESELCT_GREY : Colours.HIDDEN_GREY,
            borderRadius: `${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px 0px 0px`,
            cursor: open ? "default" : "pointer"
        }}
        clickable={onPress}
    />
}

const InventoryItems: React.FunctionComponent<{
    items: ItemMetadata[];
    onMouseEnter: (item: ItemMetadata) => void;
    onMouseLeave: (item: ItemMetadata) => void;
    onClick: (item: ItemMetadata) => void;
}> = (props) => {
    // To busy to fix this properly. This is needed to make the items re-render after being clicked. This is because inventory hasn't changed due to it being a reference and shallow checked.
    const [dummy, setDummy] = React.useState(false);
    const onClick = (item: ItemMetadata) => {
        props.onClick(item)
        setDummy(!dummy);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                height: INVENTORY_HEIGHT,
            }}
        >
            {props.items.filter(item => item.count > 0).map((item) => (
                <InventoryItemComponent
                    key={item.id}
                    itemMetadata={item}
                    style={{
                        marginLeft: 8,
                        marginTop: 8,
                        marginRight: 8,
                        marginBottom: 8,
                        cursor: "pointer",
                    }}
                    onMouseEnter={() => props.onMouseEnter(item)}
                    onMouseLeave={() => props.onMouseLeave(item)}
                    onClick={() => onClick(item)}
                />
            ))}
        </div>
    );
};

const InventoryEquipment: React.FunctionComponent<{
    inventory: Inventory;
    onMouseEnter: (item: EquipableItem) => void;
    onMouseLeave: (item: EquipableItem) => void;
    onMousePress: (item: EquipableItem) => void;
}> = (props) => {
    const { inventory, onMouseEnter, onMouseLeave, onMousePress } = props;

    const slot = (x: number, y: number, item?: EquipableItem) => (
        <EquipmentSlot
            x={x}
            y={y}
            item={item}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMousePress={onMousePress}
        />
    );

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

    function getEffectHintsFromItem(items: (EquipableItem | undefined)[]): JSX.Element {
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

        const onAttack: Effect[] = [];
        const onEquip: Effect[] = [];

        items.forEach(item => {
            if (item) {
                if (item.onAttack) {
                    onAttack.push(...item.onAttack)
                }
                if (item.onEquip) {
                    onEquip.push(...item.onEquip)
                }
            }
        })
    
        return (
            <div style={{
                position: "absolute",
                width: 244,
                height: 277,
                left: 260,
                top: 17,
                border: "solid",
                borderWidth: 1,
                borderColor: Colours.HOVER_GREY,
                borderRadius: 8,
                overflowY: "scroll",
            }}>
                {onAttack.length > 0 && (
                    <>
                    {text("On attack", TextColour.GOLD)}
                    {effectList(onAttack)}
                    </>
                )}
                {onEquip.length > 0 && (
                    <>
                    {text("On equip", TextColour.GOLD)}
                    {effectList(onEquip)}
                    </>
                )}                
            </div>
        )
    }

    return <div style={{
        position: "relative",
        width: INVENTORY_WIDTH,
        height: INVENTORY_HEIGHT
    }}>
        { 
            [
                slot(102, 58, inventory.equipped[EquipmentType.HELMET]),
                slot(102, 129, inventory.equipped[EquipmentType.BODY]),
                slot(102, 200, inventory.equipped[EquipmentType.SHOES]),
                slot(31, 129, inventory.equipped[EquipmentType.WEAPON]),
                slot(170, 129, inventory.equipped[EquipmentType.SHIELD]),
                slot(31, 200, inventory.equipped[EquipmentType.RING]),
            ]
        }

        {getEffectHintsFromItem(Object.values(inventory.equipped))}
    </div>
}

const EQUIPMENT_SLOT_SIZE = 58;
const EquipmentSlot: React.FunctionComponent<{
    item?: EquipableItem,
    onMouseEnter: (item: EquipableItem) => void;
    onMouseLeave: (item: EquipableItem) => void;
    onMousePress: (item: EquipableItem) => void;
    x: number, y: number
}> = (props) => {
    const { item, onMouseEnter, onMouseLeave, onMousePress, x, y} = props;

    const [ hover, setHover ] = React.useState(false);

    return <div 
        onMouseEnter={() => {
            if (item) {
                onMouseEnter(item);
                setHover(true);
            }
        }}
        onMouseLeave={() => {
            if (item) {
                onMouseLeave(item);
                setHover(false);
            }
        }}
        onMouseDown={() => {
            if (item) {
                onMousePress(item);
                setHover(false);
            }
        }}
        style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: EQUIPMENT_SLOT_SIZE,
            height: EQUIPMENT_SLOT_SIZE,
            border: "solid",
            borderRadius: 8,
            borderColor: Colours.HOVER_GREY,
            borderWidth: 1,
            backgroundColor: hover ? Colours.HOVER_GREY : Colours.DESELCT_GREY,
            left: x,
            top: y
        }}>
            {item && <SpriteImageComponent 
                spriteSheet={SpriteSheets.SPRITE}
                sprite={item.spriteIcon}
                style={{
                    width: EQUIPMENT_SLOT_SIZE - 16,
                    height: EQUIPMENT_SLOT_SIZE - 16
                }}
            />
            }
        </div>
}
