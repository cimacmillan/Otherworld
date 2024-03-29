import { Game } from "../Game";
import React = require("react");
import { useGlobalState } from "./effects/GlobalState";
import { HealthBarComponent } from "./components/HealthBarComponent";
import { GameMenuContainer } from "./containers/GameMenuContainer";
import { GameFadeContainer } from "./containers/GameFadeContainer";
import { WeaponComponent } from "./components/WeaponComponent";
import { PlayModeContainer } from "./containers/PlayModeContainer";
import { KeyComponent } from "./components/KeyComponent";
import { LoadingScreenContainer } from "./containers/LoadingScreenContainer";
import { ItemCollectionContainer } from "./containers/ItemCollectionContainer";

export interface UIContainerProps {}

export const UIContainer: React.FunctionComponent<UIContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();

    return (
        <div style={{ position: "absolute" }}>
            {state.uiState.canAccessGame ? (
                <>
                    <PlayModeContainer />
                    <GameFadeContainer />
                    <GameMenuContainer />
                </>
            ) : (
                <>
                    <LoadingScreenContainer />
                </>
            )}
        </div>
    );
};
