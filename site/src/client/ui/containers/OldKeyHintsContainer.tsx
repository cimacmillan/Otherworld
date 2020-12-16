import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "../components/ViewportComponent";
import { ShadowComponentStyle } from "../components/ShadowComponent";
import { ProcedureService } from "../../services/jobs/ProcedureService";

export interface KeyHintsContainerProps {
    serviceLocator: ServiceLocator;
}

interface KeyHint {
    keycode: string;
    key: string;
    hint: string;
    fade: boolean;
}

const keyStages = [
    [
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
    ],
    [
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
    ],
    [
        {
            keycode: "KeyE",
            key: "E",
            hint: "Interact",
            fade: false,
        },
    ],
    // [
    //     {
    //         keycode: "KeyI",
    //         key: "I",
    //         hint: "Inventory",
    //         fade: false,
    //     },
    // ],
    // [
    //     {
    //         keycode: "KeyI",
    //         key: "I",
    //         hint: "Close Inventory",
    //         fade: false,
    //     },
    // ],
];

const clickSpeed = 500;

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const { serviceLocator } = props;
    const [keyHints, setKeyHints] = React.useState([] as KeyHint[]);
    const [keyStage, setKeyStage] = React.useState(0);
    const [keyDown, setKeyDown] = React.useState(false);

    const addKeyHint = (keyHint: KeyHint) => {
        setKeyHints([...keyHints, keyHint]);
    };

    const removeKeyHint = (keyHint: KeyHint) => {
        const newKeyHints = keyHints.filter(
            (hint) => keyHint.keycode !== hint.keycode
        );
        setKeyHints(newKeyHints);
        if (newKeyHints.length === 0) {
            setKeyStage(keyStage + 1);
        }
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

    React.useEffect(() => {
        const timeout = ProcedureService.setTimeout(
            () => setKeyDown(!keyDown),
            clickSpeed
        );
        return () => ProcedureService.clearTimeout(timeout);
    }, [keyDown]);

    React.useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [keyHints]);

    React.useEffect(() => {
        if (keyStage < keyStages.length) {
            setKeyHints([...keyHints, ...keyStages[keyStage]]);
        }
    }, [keyStage]);

    return (
        <ViewportComponent
            x={DOM_WIDTH}
            y={DOM_HEIGHT * 0.5}
            width={DOM_WIDTH}
            height={DOM_HEIGHT * 0.5}
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
                        keyCode={keyHint.key}
                        selected={keyDown}
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