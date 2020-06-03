import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { Actions } from "../actions/Actions";

export interface InventoryUIState {
    showing: boolean;
}

const initialInventoryState = {
    showing: false,
};

export const inventoryReducer = (
    state: InventoryUIState = initialInventoryState,
    action: Actions
) => {
    switch (action.type) {
        case PlayerEventType.PLAYER_INVENTORY_OPENED:
            return {
                ...state,
                showing: true,
            };
        case PlayerEventType.PLAYER_INVENTORY_CLOSED:
            return {
                ...state,
                showing: false,
            };
    }

    return state;
};
