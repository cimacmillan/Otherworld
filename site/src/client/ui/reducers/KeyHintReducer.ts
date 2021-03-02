import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";

export interface KeyHintUIState {
    keyHints: {
        [id: string]: KeyHint;
    };
}

export interface KeyHint {
    keys: string[];
    hint: string;
}

export const keyHintReducer: Reducer<KeyHintUIState, Actions> = {
    state: {
        keyHints: {}
    },
    actions: {
        addKeyHint: (state: KeyHintUIState, action: { id: string; keys: string[]; hint: string }) => ({
            keyHints: {
                ...state.keyHints,
                [action.id]: {
                    keys: action.keys,
                    hint: action.hint,
                },
            }
        }),
        removeKeyHint: (state: KeyHintUIState, action: { id: string }) => {
            const keyHints = { ...state.keyHints };
            delete keyHints[action.id];
            return {
                keyHints
            }
        },
    },
};
