import { Actions, emptyActions } from "../Actions";
import { combineReducers, GameReducer, Store } from "../util/engine/Store";
import { gameStartReducer, GameStartState } from "./reducers/GameStartReducer";
import {
    inventoryReducer,
    InventoryUIState,
} from "./reducers/InventoryReducer";
import { keyHintReducer, KeyHintUIState } from "./reducers/KeyHintReducer";
import { minigameReducer, MiniGameUIState } from "./reducers/MiniGameReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";

export interface State {
    uiState: UIState;
    gameStart: GameStartState;
    inventory: InventoryUIState;
    minigame: MiniGameUIState;
    keyHints: KeyHintUIState;
}

export const reducers: { [key: string]: GameReducer<any, Actions> } = {
    uiState: uiReducer,
    gameStart: gameStartReducer,
    inventory: inventoryReducer,
    minigame: minigameReducer,
    keyHints: keyHintReducer,
};

export const store = new Store(
    combineReducers(reducers, emptyActions),
    emptyActions
);
