import { GameEvent, RootEventType } from "../../engine/events/Event";

export interface UIState {
    canAccessGame: boolean;
}

const initialUIState = {
    canAccessGame: false,
};

export function uiReducer(state: UIState = initialUIState, action: GameEvent) {
    switch (action.type) {
        case RootEventType.GAME_INITIALISED:
            return { ...state, canAccessGame: true };
    }
    return state;
}
