import React = require("react");
import { HealthBarComponent } from "../components/HealthBarComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { WeaponComponent } from "../components/WeaponComponent";
import { ScoreContainer } from "./ScoreContainer";
import { KeyHintsContainer } from "./KeyHintsContainer";

interface PlayModeContainerProps {
    serviceLocator: ServiceLocator;
}

export const PlayModeContainer: React.FunctionComponent<PlayModeContainerProps> = (
    props
) => {
    return (
        <>
            <HealthBarComponent serviceLocator={props.serviceLocator} />
            <WeaponComponent serviceLocator={props.serviceLocator} />
            <ScoreContainer />
            <KeyHintsContainer serviceLocator={props.serviceLocator} />
        </>
    );
};
