Otherworld uses React for its UI and a custom-built state manager called Refunc. Refunc is a Redux-like state manager which uses function defined events rather than objects. This uses the `FunctionEventSubscriber` utility, which is also used by entities, to define a reducer. Like in Redux, a reducer takes a UI state and action, to provide a new UI state. This results in a well-defined UI state, with a bit less boiler plate than Redux. For instance, the key hint reducer takes an empty object as its state, and changes state based on whether a key hint has been added or removed:

```ts
export interface KeyHint {
    keys: string[];
    hint: string;
}

export interface KeyHintUIState {
    keyHints: {
        [id: string]: KeyHint;
    };
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
```

The key hints container in React can then read this state and render key hints if they are present. It's read using a  `useGlobalState` React hook:

```ts
export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, _] = useGlobalState();
    const keyHints = state.keyHints.keyHints;
    ... //Render
}
```

The main game menus, player inventory, equipment, health, and item pickups are written in the same way.
