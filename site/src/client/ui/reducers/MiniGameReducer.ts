import {
    LockpickingResult,
    MiniGameEventType,
} from "../../engine/events/MiniGameEvents";
import { Actions } from "../actions/Actions";
import { MiniGameUIActionType } from "../actions/MiniGameActions";

export interface MiniGameUIState {
    visible: boolean;
    onComplete: (result: LockpickingResult) => void;
}

const initialMiniGameState: MiniGameUIState = {
    visible: false,
    onComplete: () => undefined,
};

export const minigameReducer = (
    state: MiniGameUIState = initialMiniGameState,
    action: Actions
): MiniGameUIState => {
    switch (action.type) {
        case MiniGameEventType.LOCKPICK:
            return {
                ...state,
                visible: true,
                onComplete: action.callback,
            };
        case MiniGameUIActionType.MINI_GAME_CLOSE:
            return {
                visible: false,
                onComplete: () => undefined,
            };
    }

    return state;
};
