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
import { Actions } from "../actions/Actions";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { ShadowComponentStyle } from "../components/ShadowComponent";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import { Item, ItemMetadata } from "../../engine/scripting/items/types";
import { GameItems } from "../../resources/manifests/Items";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { chunk } from "lodash";
import { InventoryItemComponent } from "../components/InventoryItemComponent";
import { TooltipComponent, TooltipType } from "../components/TooltipComponent";
import { Vector2D } from "../../types";
import { useServiceLocator } from "../effects/GameEffect";
import { Colours } from "../../resources/design/Colour";
import { PlayerUseItemFromInventory } from "../../engine/commands/InventoryCommands";

const FADE_IN = 200;
export const INVENTORY_WIDTH = 520;
export const INVENTORY_HEIGHT = 312;
export const INVENTORY_BORDER_RADIUS = 8;

export interface InventoryContainerProps {}

export const InventoryContainer: React.FunctionComponent<InventoryContainerProps> = (
    props
) => {
    const myRef = React.useRef();
    const getBoundingClientRect = useBoundingclientrect(myRef);
    const serviceLocator = useServiceLocator();
    const [inventoryShowing, setInventoryShowing] = React.useState(false);
    const [tooltipItem, setTooltipItem] = React.useState<
        ItemMetadata | undefined
    >(undefined);
    const [fade, setFade] = React.useState(0);
    const [mousePosition, setMousePosition] = React.useState<Vector2D>({
        x: 0,
        y: 0,
    });
    const [items, setItems] = React.useState<ItemMetadata[]>([]);
    const [state, dispatch] = useGlobalState();

    React.useEffect(() => {
        const inventoryItems = serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory().items;
        setItems(inventoryItems);
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

    const onSetItemTooltip = (itemMetadata: ItemMetadata | undefined) => {
        setTooltipItem(itemMetadata);
    };

    const onItemUsed = (itemMetadata: ItemMetadata | undefined) => {
        const { item, count } = itemMetadata;
        const itemAmount = serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory().items.length;
        PlayerUseItemFromInventory(serviceLocator)(item);
        const inventoryItems = serviceLocator
            .getScriptingService()
            .getPlayer()
            .getInventory().items;
        setItems(inventoryItems);
        if (inventoryItems.length !== itemAmount) {
            onSetItemTooltip(undefined);
        }
    };

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
                            width: INVENTORY_WIDTH,
                            height: INVENTORY_HEIGHT,
                            opacity: fade,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            ...ShadowComponentStyle(),
                        }}
                    >
                        <TextComponent
                            text={"Inventory"}
                            size={TextSize.SMALL}
                            style={{
                                paddingLeft: 8,
                                paddingRight: 8,
                                background: Colours.DESELCT_GREY,
                                borderRadius: `${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px 0px 0px`,
                            }}
                        />
                        <div
                            style={{
                                width: INVENTORY_WIDTH,
                                height: INVENTORY_HEIGHT,
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "scroll",
                                background: Colours.DESELCT_GREY,
                                borderRadius: `0px ${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px ${INVENTORY_BORDER_RADIUS}px`,
                            }}
                        >
                            <InventoryItems
                                items={items}
                                onMouseEnter={(item) => onSetItemTooltip(item)}
                                onMouseLeave={(item) =>
                                    onSetItemTooltip(undefined)
                                }
                                onClick={(item) => onItemUsed(item)}
                            />
                        </div>
                    </div>
                )}
                {tooltipItem && inventoryShowing && (
                    <TooltipComponent
                        serviceLocator={serviceLocator}
                        context={{
                            type: TooltipType.ITEM,
                            itemMetadata: tooltipItem,
                        }}
                        position={mousePosition}
                    />
                )}
            </ViewportComponent>
        </div>
    );
};

const InventoryItems: React.FunctionComponent<{
    items: ItemMetadata[];
    onMouseEnter: (item: ItemMetadata) => void;
    onMouseLeave: (item: ItemMetadata) => void;
    onClick: (item: ItemMetadata) => void;
}> = (props) => {
    return (
        <div>
            {props.items.map((item) => (
                <InventoryItemComponent
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
                    onClick={() => props.onClick(item)}
                />
            ))}
        </div>
    );
};
