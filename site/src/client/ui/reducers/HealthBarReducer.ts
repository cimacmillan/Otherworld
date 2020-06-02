import { GameEvent } from "../../engine/events/Event";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import {
    GameStartActions,
    GameStartActionType,
} from "../actions/GameStartActions";

export interface HealthBarState {
    health: number;
    showing: boolean;
}

const initialHealthState = {
    health: 1,
    showing: true,
};

type HealthBarEvents = GameEvent | GameStartActions;

export function healthBarReducer(
    state: HealthBarState = initialHealthState,
    action: HealthBarEvents
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
