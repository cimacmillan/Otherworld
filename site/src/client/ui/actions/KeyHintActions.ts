export interface KeyHintContainerActions {
    addKeyHint: (args: { id: string; keys: string[]; hint: string }) => void;

    removeKeyHint: (args: { id: string }) => void;
}
