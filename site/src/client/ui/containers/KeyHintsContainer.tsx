import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "../components/ViewportComponent";

export interface KeyHintsContainerProps {
    serviceLocator: ServiceLocator;
}

interface KeyHint {
    keycode: string;
    key: string;
    hint: string;
    fade: boolean;
}

const initialState = [
    {
        keycode: "KeyW",
        key: "W",
        hint: "Walk forwards",
        fade: false,
    },
    {
        keycode: "KeyS",
        key: "S",
        hint: "Walk backwards",
        fade: false,
    },
    {
        keycode: "KeyA",
        key: "A",
        hint: "Walk left",
        fade: false,
    },
    {
        keycode: "KeyD",
        key: "D",
        hint: "Walk right",
        fade: false,
    },
    {
        keycode: "KeyE",
        key: "E",
        hint: "Attack",
        fade: false,
    },
    {
        keycode: "ArrowLeft",
        key: "←",
        hint: "Turn Left",
        fade: false,
    },
    {
        keycode: "ArrowRight",
        key: "→",
        hint: "Turn Right",
        fade: false,
    },
];

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [keyHints, setKeyHints] = React.useState(initialState as KeyHint[]);

    const addKeyHint = (keyHint: KeyHint) => {
        setKeyHints([...keyHints, keyHint]);
    };

    const removeKeyHint = (keyHint: KeyHint) => {
        console.log(`removeHint ${keyHint.keycode}`);
        setKeyHints(
            keyHints.filter((hint) => keyHint.keycode !== hint.keycode)
        );
    };

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
        setKeyHints(
            keyHints.map((keyHint) => {
                return {
                    ...keyHint,
                    fade: keyHint.fade
                        ? true
                        : keyboardEvent.code === keyHint.keycode,
                };
            })
        );
    };

    console.log(keyHints);

    React.useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    return (
        <ViewportComponent
            x={0}
            y={0}
            width={DOM_WIDTH}
            height={DOM_HEIGHT}
            style={{
                display: "flex",
                justifyContent: "flex-end",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                }}
            >
                {keyHints.map((keyHint) => (
                    <KeyHintComponent
                        key={keyHint.key}
                        serviceLocator={props.serviceLocator}
                        keyCode={keyHint.key}
                        selected={false}
                        text={keyHint.hint}
                        style={{}}
                        fade={keyHint.fade}
                        onFadeComplete={() => removeKeyHint(keyHint)}
                    />
                ))}
            </div>
        </ViewportComponent>
    );
};
