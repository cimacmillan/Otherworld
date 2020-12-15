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
import { GamePanelComponent } from "../components/GamePanelComponent";
import { ShadowComponentStyle } from "../components/ShadowComponent";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import { ItemMetadata } from "../../engine/scripting/items/types";
import { GameItems } from "../../resources/manifests/Items";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { chunk } from "lodash";
import { InventoryItemComponent } from "../components/InventoryItemComponent";
import { TooltipComponent, TooltipType } from "../components/TooltipComponent";
import { Vector2D } from "../../types";
import { useServiceLocator } from "../effects/GameEffect";

const FADE_IN = 200;
const WIDTH = 520;
const HEIGHT = 312;
const ITEM_GRID_WIDTH = 7;

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
        // const inventoryItems = serviceLocator
        //     .getScriptingService()
        //     .getPlayer()
        //     .getState().inventory.items;
        // setItems(inventoryItems);
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

    const itemGrid = chunk(items, ITEM_GRID_WIDTH);
    const inventoryItemLines = itemGrid.map((itemMetadatas: ItemMetadata[]) => (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            {itemMetadatas.map((metadata) => (
                <InventoryItemComponent
                    serviceLocator={serviceLocator}
                    itemMetadata={metadata}
                    style={{
                        marginLeft: 10,
                        marginTop: 10,
                        cursor: "pointer",
                    }}
                    onMouseEnter={() => onSetItemTooltip(metadata)}
                    onMouseLeave={() =>
                        tooltipItem === metadata && onSetItemTooltip(undefined)
                    }
                    onClick={() => {
                        // const itemAmount = serviceLocator
                        //     .getScriptingService()
                        //     .getPlayer()
                        //     .getState().inventory.items.length;
                        // serviceLocator
                        //     .getScriptingService()
                        //     .inventoryService.useItemFromInventory(
                        //         serviceLocator
                        //             .getScriptingService()
                        //             .getPlayer(),
                        //         metadata
                        //     );
                        // const inventoryItems = serviceLocator
                        //     .getScriptingService()
                        //     .getPlayer()
                        //     .getState().inventory.items;
                        // setItems(inventoryItems);
                        // if (
                        //     serviceLocator
                        //         .getScriptingService()
                        //         .getPlayer()
                        //         .getState().inventory.items.length !==
                        //     itemAmount
                        // ) {
                        //     onSetItemTooltip(undefined);
                        // }
                    }}
                />
            ))}
        </div>
    ));

    const onSetItemTooltip = (itemMetadata: ItemMetadata | undefined) => {
        setTooltipItem(itemMetadata);
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
                    <GamePanelComponent
                        serviceLocator={serviceLocator}
                        width={WIDTH}
                        height={HEIGHT}
                        style={{
                            opacity: fade,
                            ...ShadowComponentStyle(),
                        }}
                        childStyle={{
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "scroll",
                        }}
                    >
                        {inventoryItemLines}
                    </GamePanelComponent>
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
