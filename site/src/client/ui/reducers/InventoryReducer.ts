import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";

export interface InventoryUIState {
    showing: boolean;
}

export const inventoryReducer: Reducer<InventoryUIState, Actions> = {
    state: {
        showing: false
    },
    actions: {
        onPlayerInventoryOpened: () => ({
            showing: true
        }),
        onPlayerInventoryClosed: () => ({
            showing: false
        }),
    },
};
