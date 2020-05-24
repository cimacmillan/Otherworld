import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "../components/ViewportComponent";
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

const FADE_IN = 200;
const WIDTH = 600;
const HEIGHT = 400;

export interface InventoryContainerProps {
    serviceLocator: ServiceLocator;
}

export const InventoryContainer: React.FunctionComponent<InventoryContainerProps> = (
    props
) => {
    const { serviceLocator } = props;
    const [inventoryShowing, setInventoryShowing] = React.useState(false);
    const [fade, setFade] = React.useState(0);

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
                    .whenDone(() => setInventoryShowing(false));
                break;
        }
    });

    return (
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
                        ...ShadowComponentStyle()
                    }}
                    childStyle={{}}
                    panelMap={DARK_PANEL}
                > 
                    <InventoryItemComponent
                        serviceLocator={serviceLocator}
                        itemMetadata={{
                            item: GameItems.ITEM_MACATOR_INNARDS,
                            count: 100
                        }}
                    />
                </GamePanelComponent>

            )}
        </ViewportComponent>
    );
};

const INVENTORY_ITEM_SIZE = 48;
const INVENTORY_PANEL_SIZE = 64;
const INVENTORY_ITEM_SIZE_INCREASE = 8;
const INVENTORY_ITEM_SIZE_SPEED = 200;

interface InventoryItemComponentProps {
    serviceLocator: ServiceLocator;
    itemMetadata: ItemMetadata;
}

export const InventoryItemComponent: React.FunctionComponent<InventoryItemComponentProps> = props => {
    const { serviceLocator, itemMetadata } = props;
    const { item, count } = itemMetadata;

    const [hover, setHover] = React.useState(false);
    const [size, setSize] = React.useState(0);
    const [sizeAnimation, setSizeAnimation] = React.useState<GameAnimation | undefined>(undefined);

    const onMouseEnter = () => {
        setHover(true);
        if (sizeAnimation) {
            sizeAnimation.stop();
        }
        const anim = animation(setSize).driven().speed(INVENTORY_ITEM_SIZE_SPEED).start();
        setSizeAnimation(anim);
    };
    const onMouseLeave = () => {
        setHover(false);
        if (sizeAnimation) {
            sizeAnimation.stop();
        }
        const anim = animation(x => setSize(1 - x)).driven().speed(INVENTORY_ITEM_SIZE_SPEED).start();
        setSizeAnimation(anim);
    }

    const sizeOffset = size * INVENTORY_ITEM_SIZE_INCREASE;
    const numberOffset = INVENTORY_PANEL_SIZE / 8;

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    width: INVENTORY_PANEL_SIZE,
                    height: INVENTORY_PANEL_SIZE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <SpriteImageComponent
                    serviceLocator={serviceLocator}
                    sprite={hover ? UISPRITES.ITEM_PANEL_HOVER : UISPRITES.ITEM_PANEL}
                    spriteSheet={SpriteSheets.UI}
                    style={{
                        position: "absolute",
                        width: INVENTORY_PANEL_SIZE,
                        height: INVENTORY_PANEL_SIZE
                    }}
                /> 
                <SpriteImageComponent
                    serviceLocator={serviceLocator}
                    sprite={item.spriteIcon}
                    spriteSheet={SpriteSheets.SPRITE}
                    style={{
                        position: "absolute",
                        width: INVENTORY_ITEM_SIZE + sizeOffset,
                        height: INVENTORY_ITEM_SIZE + sizeOffset
                    }}
                />  
            </div>
            <div style={{
                position: "absolute",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: INVENTORY_PANEL_SIZE,
                height: INVENTORY_PANEL_SIZE,
                pointerEvents: "none"
            }}>
                <TextComponent
                        text={`${count}`}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                        style={{
                            transform: `translate(${numberOffset}px, ${numberOffset}px)`
                        }}
                    />
            </div>
        </>
    );
}