import { isEqual } from "lodash";
import React = require("react");

import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { ProcedureService } from "../../services/jobs/ProcedureService";
import {
    KeyHintComponent,
    KeyHintComponentProps,
} from "../components/KeyHintComponent";
import { ShadowComponentStyleAlpha } from "../components/ShadowComponent";
import { useGlobalState } from "../effects/GlobalState";
import { KeyHint } from "../reducers/KeyHintReducer";
import { AnimationGroupContainer } from "./FadeGroupContainer";

export interface KeyHintsContainerProps {}

interface KeyHintInstance {
    keyHint: KeyHint;
    shouldBeShown: boolean;
}

export interface KeyHintInstanceMap {
    [id: string]: KeyHintInstance;
}

const Y_POS_RATIO = 0.8;

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const [keyDown, setKeyDown] = React.useState(false);
    const keyHints = state.keyHints.keyHints;
    const keys = Object.keys(keyHints);
    const keyComponentsProps: any[] = keys.map((key) => {
        const keyHint = keyHints[key];
        return {
            key,
            keyCode: keyHint.keys,
            selected: keyDown,
            text: keyHint.hint,
            // style: ShadowComponentStyleAlpha(),
        };
    });

    const render = (
        props: KeyHintComponentProps,
        x: number,
        fadingIn: boolean
    ) => {
        const val = fadingIn ? -1 + x : 1 - x;
        return <KeyHintComponent {...props} x={val} />;
    };

    return (
        <div
            style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                marginTop: DOM_HEIGHT * Y_POS_RATIO,
                width: DOM_WIDTH,
                height: DOM_HEIGHT * (1.0 - Y_POS_RATIO),
            }}
        >
            <AnimationGroupContainer
                fadeInMs={200}
                fadeOutMs={200}
                list={keyComponentsProps}
                render={render}
            />
        </div>
    );
};

const collapse = (st: string[]): string => {
    return st.reduce((prev, current) => prev + current, "");
};
