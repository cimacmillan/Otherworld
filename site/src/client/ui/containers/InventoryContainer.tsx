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
import { useDispatchListener } from "../effects/GlobalState";
import { Actions } from "../actions/Actions";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { GamePanelComponent } from "../components/GamePanelComponent";
import { DARK_PANEL } from "../../resources/manifests/DarkPanel";
import { ShadowComponentStyle } from "../components/ShadowComponent";
import { SpriteImageComponent } from "../components/SpriteImageComponent";
import { ItemMetadata } from "../../services/scripting/items/types";
import { SpriteSheets, UISPRITES } from "../../resources/manifests/Types";
import { GameItems } from "../../resources/manifests/Items";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { chunk } from "lodash";
import { InventoryItemComponent } from "../components/InventoryItemComponent";
import { TooltipComponent, TooltipType } from "../components/TooltipComponent";
import { Vector2D } from "../../types";

const FADE_IN = 200;
const WIDTH = 520;
const HEIGHT = 312;
const ITEM_GRID_WIDTH = 7;

export interface InventoryContainerProps {
    serviceLocator: ServiceLocator;
}

export const InventoryContainer: React.FunctionComponent<InventoryContainerProps> = (
    props
) => {
    const myRef = React.useRef();
    const getBoundingClientRect = useBoundingclientrect(myRef);
    const { serviceLocator } = props;
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

    React.useEffect(() => {
        const inventoryItems = serviceLocator
            .getScriptingService()
            .getPlayer()
            .getState().inventory.items;
        setItems(inventoryItems);
    });

    useDispatchListener((action: Actions) => {
        switch (action.type) {
            case PlayerEventType.PLAYER_INVENTORY_OPENED:
                setInventoryShowing(true);
                animation(setFade).speed(FADE_IN).driven().start();
                break;
            case PlayerEventType.PLAYER_INVENTORY_CLOSED:
                animation((x) => setFade(1 - x))
                    .speed(FADE_IN)
                    .driven()
                    .start()
                    .whenDone(() => {
                        setInventoryShowing(false);
                        setTooltipItem(undefined);
                    });
                break;
        }
    });

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
                        const itemAmount = serviceLocator
                            .getScriptingService()
                            .getPlayer()
                            .getState().inventory.items.length;

                        serviceLocator
                            .getScriptingService()
                            .inventoryService.useItemFromInventory(
                                serviceLocator
                                    .getScriptingService()
                                    .getPlayer(),
                                metadata
                            );

                        const inventoryItems = serviceLocator
                            .getScriptingService()
                            .getPlayer()
                            .getState().inventory.items;

                        setItems(inventoryItems);

                        if (
                            serviceLocator
                                .getScriptingService()
                                .getPlayer()
                                .getState().inventory.items.length !==
                            itemAmount
                        ) {
                            onSetItemTooltip(undefined);
                        }
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
                        serviceLocator={props.serviceLocator}
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
                        panelMap={DARK_PANEL}
                    >
                        {inventoryItemLines}
                    </GamePanelComponent>
                )}
                {tooltipItem && inventoryShowing && (
                    <TooltipComponent
                        serviceLocator={props.serviceLocator}
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
