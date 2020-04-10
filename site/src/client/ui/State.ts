import { combineReducers } from "redux";
import { uiReducer, UIState } from "./reducers/UIReducer";
import { weaponReducer, WeaponState } from "./reducers/WeaponReducer";

export interface State {
    uiState: UIState;
    weaponState: WeaponState;
}

export const reducers = combineReducers({
    uiState: uiReducer,
    weaponState: weaponReducer,
});
