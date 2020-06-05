import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { Actions } from "../actions/Actions";
import { GameStartActionType } from "../actions/GameStartActions";

export interface WeaponState {
    showing: boolean;
}

const initialWeaponState = {
    showing: false,
};

export function weaponReducer(
    state: WeaponState = initialWeaponState,
    action: Actions
) {
    switch (action.type) {
        case GameStartActionType.START_GAME:
            return {
                ...state,
                showing: true,
            };
        case PlayerEventType.PLAYER_KILLED:
            return {
                ...state,
                showing: false,
            };
    }
    return state;
}
