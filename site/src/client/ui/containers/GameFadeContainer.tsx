import React = require("react");
import { connect } from "react-redux";
import { State, useGlobalState } from "../State";
import { Subscription } from "rxjs";
import { ServiceLocator } from "../../services/ServiceLocator";
import { startGame } from "../actions/GameStartActions";
import { FadeComponent } from "../components/FadeComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";

interface GameFadeContainerProps {
    serviceLocator: ServiceLocator;
}

export const GameFadeContainer: React.FunctionComponent<GameFadeContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    return (
        <FadeComponent
            shouldShow={state.gameStart.showing}
            fadeInSpeed={1000}
            fadeOutSpeed={300}
        >
            <div
                style={{
                    width: DOM_WIDTH,
                    height: DOM_HEIGHT,
                    position: "absolute",
                    backgroundColor: "#000000",
                }}
            />
        </FadeComponent>
    );
};
