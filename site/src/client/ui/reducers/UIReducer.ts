import { Subject } from "rxjs";
import { GameEvent, RootEventType } from "../../engine/events/Event";

export interface UIState {
    canAccessGame: boolean;
    bounceCount: number;
}

const initialUIState = {
    canAccessGame: false,
    bounceCount: 0,
};

export const GameEventSubject = new Subject<GameEvent>();

export function uiReducer(state: UIState = initialUIState, action: GameEvent) {
    GameEventSubject.next(action);
    switch (action.type) {
        case RootEventType.GAME_INITIALISED:
            return { ...state, canAccessGame: true };
    }
    return state;
}
