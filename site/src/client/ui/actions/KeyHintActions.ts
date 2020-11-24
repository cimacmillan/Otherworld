export enum KeyHintContainerActionType {
    ADD_KEY_HINT = "ADD_KEY_HINT",
    REMOVE_KEY_HINT = "REMOVE_KEY_HINT",
}

interface AddKeyHint {
    type: KeyHintContainerActionType.ADD_KEY_HINT;
    id: number;
    key: string;
    hint: string;
}

interface RemoveKeyHint {
    type: KeyHintContainerActionType.REMOVE_KEY_HINT;
    id: number;
}

export type KeyHintContainerActions = AddKeyHint | RemoveKeyHint;
