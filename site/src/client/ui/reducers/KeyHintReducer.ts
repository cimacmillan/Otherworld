import { Actions } from "../../Actions";
import { GameReducer } from "../../util/engine/Store";

export interface KeyHintUIState {
    keyHints: {
        [id: string]: KeyHint;
    };
}

export interface KeyHint {
    keys: string[];
    hint: string;
}

let initialKeyHintUIState: KeyHintUIState = {
    keyHints: {},
};

export const keyHintReducer: GameReducer<KeyHintUIState, Actions> = {
    getState: () => initialKeyHintUIState,
    actions: {
        addKeyHint: (action: { id: string; keys: string[]; hint: string }) => {
            initialKeyHintUIState = {
                keyHints: {
                    ...initialKeyHintUIState.keyHints,
                    [action.id]: {
                        keys: action.keys,
                        hint: action.hint,
                    },
                },
            };
        },
        removeKeyHint: (action: { id: string }) => {
            const keyHints = { ...initialKeyHintUIState.keyHints };
            delete keyHints[action.id];
            initialKeyHintUIState = {
                keyHints,
            };
        },
    },
};
