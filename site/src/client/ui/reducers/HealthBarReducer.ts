import { GameEvent } from "../../engine/events/Event";
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
        case GameStartActionType.END_GAME:
            return {
                ...state,
                showing: false,
            };
    }
    return state;
}
