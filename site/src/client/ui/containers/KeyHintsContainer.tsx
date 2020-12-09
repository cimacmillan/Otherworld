import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { ViewportComponent } from "../components/ViewportComponent";
import {
    ShadowComponentStyle,
    ShadowComponentStyleSmall,
    ShadowComponentStyleAlpha,
} from "../components/ShadowComponent";
import { ProcedureService } from "../../services/jobs/ProcedureService";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { useGlobalState } from "../effects/GlobalState";
import { KeyHint } from "../reducers/KeyHintReducer";
import { isEqual } from "lodash";

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

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const [keyDown, setKeyDown] = React.useState(false);
    const [keyHints, setKeyHints] = React.useState(initialState);

    React.useEffect(() => {
        const newKeyHints = {} as KeyHintInstanceMap;
        Object.entries(keyHints).forEach(([key, value]) => {
            newKeyHints[key] = {
                keyHint: value.keyHint,
                shouldBeShown: false,
            };
        });
        Object.entries(state.keyHints.keyHints).forEach(([key, value]) => {
            newKeyHints[key] = {
                keyHint: value,
                shouldBeShown: true,
            };
        });
        if (!isEqual(keyHints, newKeyHints)) {
            setKeyHints(newKeyHints);
        }
    });

    const removeKeyHint = (key: string) => {
        const newKeyHints = { ...keyHints };
        delete newKeyHints[key];
        setKeyHints(newKeyHints);
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
        const keyHint = keyHints[key].keyHint;
        return (
            <KeyHintComponent
                keyCode={keyHint.key}
                selected={keyDown}
                text={keyHint.hint}
                style={{
                    ...ShadowComponentStyleAlpha(),
                }}
                fade={!keyHints[key].shouldBeShown}
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
                marginTop: DOM_HEIGHT * 0.5,
                width: DOM_WIDTH,
                height: DOM_HEIGHT * 0.5,
            }}
        >
            {keyComponents}
        </div>
    );
};
