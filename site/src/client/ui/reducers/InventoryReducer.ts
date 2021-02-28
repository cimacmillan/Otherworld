import { Actions } from "../../Actions";
import { GameReducer } from "../../util/engine/Store";

export interface InventoryUIState {
    showing: boolean;
}

const initialInventoryState = {
    showing: false,
};

export const inventoryReducer: GameReducer<InventoryUIState, Actions> = {
    getState: () => initialInventoryState,
    actions: {
        onPlayerInventoryOpened: () => {
            initialInventoryState.showing = true;
        },
        onPlayerInventoryClosed: () => {
            initialInventoryState.showing = false;
        },
    },
};
