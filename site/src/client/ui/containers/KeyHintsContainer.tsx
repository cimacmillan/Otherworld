import { isEqual } from "lodash";
import React = require("react");

import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { ProcedureService } from "../../services/jobs/ProcedureService";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { ShadowComponentStyleAlpha } from "../components/ShadowComponent";
import { useGlobalState } from "../effects/GlobalState";
import { KeyHint } from "../reducers/KeyHintReducer";

export interface KeyHintsContainerProps {}

interface KeyHintInstance {
    keyHint: KeyHint;
    shouldBeShown: boolean;
}

export interface KeyHintInstanceMap {
    [id: string]: KeyHintInstance;
}

const clickSpeed = 500;
const initialState = {} as KeyHintInstanceMap;
const Y_POS_RATIO = 0.7;

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const [keyDown, setKeyDown] = React.useState(false);
    // const [keyHints, setKeyHints] = React.useState(initialState);
    const keyHints = state.keyHints.keyHints;

    // React.useEffect(() => {
    //     const newKeyHints = {} as KeyHintInstanceMap;
    //     Object.entries(keyHints).forEach(([key, value]) => {
    //         newKeyHints[key] = {
    //             keyHint: value.keyHint,
    //             shouldBeShown: false,
    //         };
    //     });
    //     Object.entries(state.keyHints.keyHints).forEach(([key, value]) => {
    //         newKeyHints[key] = {
    //             keyHint: value,
    //             shouldBeShown: true,
    //         };
    //     });
    //     if (!isEqual(keyHints, newKeyHints)) {
    //         setKeyHints(newKeyHints);
    //     }
    // });

    const removeKeyHint = (key: string) => {
        // const newKeyHints = { ...keyHints };
        // delete newKeyHints[key];
        // setKeyHints(newKeyHints);
    };

    // const { keyHints } = state.keyHints;
    const keys = Object.keys(keyHints);

    React.useEffect(() => {
        const timeout = ProcedureService.setTimeout(
            () => setKeyDown(!keyDown),
            clickSpeed
        );
        return () => ProcedureService.clearTimeout(timeout);
    }, [keyDown]);

    if (keys.length === 0) {
        return null;
    }

    const keyComponents = keys.map((key) => {
        const keyHint = keyHints[key];
        return (
            <KeyHintComponent
                key={collapse([...keyHint.keys, keyHint.hint])}
                keyCode={keyHint.keys}
                selected={keyDown}
                text={keyHint.hint}
                style={{
                    ...ShadowComponentStyleAlpha(),
                }}
                fade={false}
                onFadeComplete={() => removeKeyHint(key)}
            />
        );
    });

    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: DOM_HEIGHT * Y_POS_RATIO,
                width: DOM_WIDTH,
                height: DOM_HEIGHT * (1.0 - Y_POS_RATIO),
            }}
        >
            {keyComponents}
        </div>
    );
};

const collapse = (st: string[]): string => {
    return st.reduce((prev, current) => prev + current, "");
};
