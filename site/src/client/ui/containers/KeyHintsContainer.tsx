import React = require("react");
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { ServiceLocator } from "../../services/ServiceLocator";

export interface KeyHintsContainerProps {
    serviceLocator: ServiceLocator;
}

export const KeyHintsContainer: React.FunctionComponent<KeyHintsContainerProps> = (
    props
) => {
    return (
        <div
            style={{
                position: "absolute",
                width: DOM_WIDTH,
                height: DOM_HEIGHT,
                display: "flex",
                justifyContent: "flex-end",
            }}
        >
            <KeyHintComponent
                serviceLocator={props.serviceLocator}
                keyCode={"W"}
                selected={false}
                text={"walk forwards"}
                style={{}}
            />
        </div>
    );
};
