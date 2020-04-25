import { GameEvent } from "../../engine/events/Event";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import {
    GameStartActions,
    GameStartActionType,
} from "../actions/GameStartActions";

export interface HealthBarState {
    showing: boolean;
}

const initialHealthState = {
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
    }
    return state;
}
