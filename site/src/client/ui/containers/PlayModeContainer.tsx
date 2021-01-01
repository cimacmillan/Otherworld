import React = require("react");
import { HealthBarComponent } from "../components/HealthBarComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { WeaponComponent } from "../components/WeaponComponent";
import { ScoreContainer } from "./ScoreContainer";
import { KeyHintsContainer } from "./KeyHintsContainer";
import { useGlobalState } from "../effects/GlobalState";
import { InventoryContainer } from "./InventoryContainer";
import { ItemCollectionContainer } from "./ItemCollectionContainer";
import { MiniGameContainer } from "./minigame/MiniGameContainer";

interface PlayModeContainerProps {}

export const PlayModeContainer: React.FunctionComponent<PlayModeContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    if (state.gameStart.showingMenu) {
        return <></>;
    }

    return (
        <>
            <HealthBarComponent />
            <WeaponComponent />
            <ScoreContainer />
            <KeyHintsContainer />
            <ItemCollectionContainer />
            <InventoryContainer />
            <MiniGameContainer />
        </>
    );
};
