import { Actions } from "../actions/Actions";
import { KeyHintContainerActionType } from "../actions/KeyHintActions";

export interface KeyHintUIState {
    keyHints: {
        [id: string]: {
            key: string;
            hint: string;
        };
    };
}

const initialKeyHintUIState: KeyHintUIState = {
    keyHints: {},
};

export const keyHintReducer = (
    state: KeyHintUIState = initialKeyHintUIState,
    action: Actions
): KeyHintUIState => {
    switch (action.type) {
        case KeyHintContainerActionType.ADD_KEY_HINT:
            return {
                keyHints: {
                    ...state.keyHints,
                    [action.id]: {
                        key: action.key,
                        hint: action.hint,
                    },
                },
            };
        case KeyHintContainerActionType.REMOVE_KEY_HINT:
            const keyHints = { ...state.keyHints };
            delete keyHints[action.id];
            return {
                keyHints,
            };
    }

    return state;
};
