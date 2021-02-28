import { Actions } from "../../Actions";
import { GameReducer } from "../../util/engine/Store";

export interface UIState {
    canAccessGame: boolean;
}

const initialUIState = {
    canAccessGame: false,
};

export const uiReducer: GameReducer<UIState, Actions> = {
    getState: () => initialUIState,
    actions: {
        onGameInitialised: () => {
            initialUIState.canAccessGame = true;
        },
    },
};
