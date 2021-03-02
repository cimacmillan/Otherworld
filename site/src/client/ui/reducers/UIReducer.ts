import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";

export interface UIState {
    canAccessGame: boolean;
}

export const uiReducer: Reducer<UIState, Actions> = {
    state: {
        canAccessGame: false,
    },
    actions: {
        onGameInitialised: (state: UIState) => ({...state, canAccessGame: true})
    },
};
