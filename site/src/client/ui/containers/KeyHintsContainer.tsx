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

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    if (Object.keys(state.keyHints.keyHints).length === 0) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: DOM_WIDTH,
                height: DOM_HEIGHT,
            }}
        >
            <KeyHintComponent
                keyCode={"W"}
                selected={false}
                text={"to go forwards"}
                style={{
                    ...ShadowComponentStyleAlpha(),
                }}
                fade={true}
                onFadeComplete={() => undefined}
            />
        </div>
    );
};
