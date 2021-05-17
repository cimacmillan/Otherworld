import { combineReducers, Store } from "@cimacmillan/refunc";
import { Actions, emptyActions } from "../Actions";
import { gameStartReducer, GameStartState } from "./reducers/GameStartReducer";
import {
    inventoryReducer,
    InventoryUIState,
} from "./reducers/InventoryReducer";
import { keyHintReducer, KeyHintUIState } from "./reducers/KeyHintReducer";
import { minigameReducer, MiniGameUIState } from "./reducers/MiniGameReducer";
import { playerReducer, PlayerReducerState } from "./reducers/PlayerReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";

export interface State {
    uiState: UIState;
    gameStart: GameStartState;
    inventory: InventoryUIState;
    minigame: MiniGameUIState;
    keyHints: KeyHintUIState;
    player: PlayerReducerState;
}

export const reducers = {
    uiState: uiReducer,
    gameStart: gameStartReducer,
    inventory: inventoryReducer,
    minigame: minigameReducer,
    keyHints: keyHintReducer,
    player: playerReducer,
};

export const store = new Store<State, Actions>(
    combineReducers<State, Actions>(reducers),
    emptyActions
);
