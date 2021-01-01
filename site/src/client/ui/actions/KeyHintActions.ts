export enum KeyHintContainerActionType {
    ADD_KEY_HINT = "ADD_KEY_HINT",
    REMOVE_KEY_HINT = "REMOVE_KEY_HINT",
}

interface AddKeyHint {
    type: KeyHintContainerActionType.ADD_KEY_HINT;
    id: string;
    keys: string[];
    hint: string;
}

interface RemoveKeyHint {
    type: KeyHintContainerActionType.REMOVE_KEY_HINT;
    id: string;
}

export type KeyHintContainerActions = AddKeyHint | RemoveKeyHint;
