import { BallEventType } from "../../engine/events/BallEvents";
import { GameEvent, RootEventType } from "../../engine/events/Event";

export interface UIState {
    canAccessGame: boolean;
    bounceCount: number;
}

const initialUIState = {
    canAccessGame: false,
    bounceCount: 0,
};

export function uiReducer(state: UIState = initialUIState, action: GameEvent) {
    switch (action.type) {
        case RootEventType.GAME_INITIALISED:
            return { ...state, canAccessGame: true };
        case BallEventType.BOUNCE:
            return { ...state, bounceCount: state.bounceCount + 1 };
    }
    return state;
}
