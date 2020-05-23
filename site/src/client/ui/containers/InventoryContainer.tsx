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

const FADE_IN = 200;

export interface InventoryContainerProps {
    serviceLocator: ServiceLocator;
}

export const InventoryContainer: React.FunctionComponent<InventoryContainerProps> = (
    props
) => {
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
                <TextComponent
                    text={"Inventory"}
                    colour={TextColour.LIGHT}
                    size={TextSize.BIG}
                    font={TextFont.REGULAR}
                    style={{ opacity: fade }}
                />
            )}
        </ViewportComponent>
    );
};
