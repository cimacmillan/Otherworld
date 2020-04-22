import { combineReducers } from "redux";
import { Subject } from "rxjs";
import { GameEvent } from "../engine/events/Event";
import { gameStartReducer, GameStartState } from "./reducers/GameStartReducer";
import { healthBarReducer, HealthBarState } from "./reducers/HealthBarReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";
import { weaponReducer, WeaponState } from "./reducers/WeaponReducer";

export interface State {
    uiState: UIState;
    weaponState: WeaponState;
    healthState: HealthBarState;
    gameStart: GameStartState;
}

export const reducers = combineReducers({
    uiState: uiReducer,
    weaponState: weaponReducer,
    healthState: healthBarReducer,
    gameStart: gameStartReducer,
});

export const GameEventSubject = new Subject<GameEvent>();
