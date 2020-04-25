import { Game } from "../Game";
import React = require("react");
import { useGlobalState } from "./State";
import HealthBarComponent from "./components/HealthBarComponent";
import { GameMenuContainer } from "./containers/GameMenuContainer";
import WeaponComponent from "./components/WeaponComponent";
import GameFadeContainer from "./containers/GameFadeContainer";

export interface UIContainerProps {
    game: Game;
}

export const UIContainer: React.FunctionComponent<UIContainerProps> = props => {

    const [state, dispatch] = useGlobalState(); 

    return (
    <div style={{ position: "absolute" }}>
        {state.uiState.canAccessGame ? (
            <>
                {/* <HealthBarComponent
                    serviceLocator={props.game.getServiceLocator()}
                />
                <WeaponComponent
                    serviceLocator={props.game.getServiceLocator()}
                />
                <GameFadeContainer
                    serviceLocator={props.game.getServiceLocator()}
                /> */}
                <GameMenuContainer
                    serviceLocator={props.game.getServiceLocator()}
                />
            </>
        ) : undefined}
    </div>
    );
}
