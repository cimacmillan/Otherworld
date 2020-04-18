import { combineReducers } from "redux";
import { healthBarReducer, HealthBarState } from "./reducers/HealthBarReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";
import { weaponReducer, WeaponState } from "./reducers/WeaponReducer";

export interface State {
    uiState: UIState;
    weaponState: WeaponState;
    healthState: HealthBarState;
}

export const reducers = combineReducers({
    uiState: uiReducer,
    weaponState: weaponReducer,
    healthState: healthBarReducer,
});
