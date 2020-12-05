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

export interface KeyHintsContainerProps {
    // serviceLocator: ServiceLocator;
}

const clickSpeed = 500;

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const [keyDown, setKeyDown] = React.useState(false);

    const { keyHints } = state.keyHints;
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
                keyCode={keyHint.key}
                selected={keyDown}
                text={keyHint.hint}
                style={{
                    ...ShadowComponentStyleAlpha(),
                }}
                fade={true}
                onFadeComplete={() => undefined}
            />
        );
    });

    return (
        <div
            style={{
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
