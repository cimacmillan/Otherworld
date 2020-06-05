import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { Actions } from "../actions/Actions";
import { GameStartActionType } from "../actions/GameStartActions";

export interface HealthBarState {
    health: number;
    showing: boolean;
}

const initialHealthState = {
    health: 1,
    showing: true,
};

export function healthBarReducer(
    state: HealthBarState = initialHealthState,
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
        case PlayerEventType.PLAYER_INFO_CHANGE:
            return {
                ...state,
                health: action.payload.health,
            };
    }
    return state;
}
